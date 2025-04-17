import React, { Fragment, useState, useRef } from 'react'
import { isUndefined } from 'lodash'
import moment from 'moment'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


// import xlsx reader
import * as XLSX from 'xlsx'

// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../../../src/addons/dragAndDrop/styles.scss'

import { checkIfSemesterAndModuleExist } from './dataChange';
import { moveAppointmentsToCondensedWeek } from '../tools/functions'


export const DropField = (setWelcomeDialogOpen, handleOpenGroupingDialog, developerMode,
    setDropFieldIsVisible, handleChange, semestersMap, showAlertMessage) => {

    // console.log("DropField", setWelcomeDialogOpen, handleOpenGroupingDialog,
    //     setDropFieldIsVisible, handleChange, semestersMap)

    if (isUndefined(semestersMap)) {
        console.warn("semestersMap undefined! That should not be!") // Todo: should never be undefined!
        semestersMap = {}
    }

    const [file, setFile] = useState(null);
    const [file4, setFile4] = useState(null);
    const [lecturers, setLecturers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [openUploadAlertDialog, setOpenUploadAlertDialog] = useState(false);

    const dropRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            setFile(files[0]);
            checkForPresentAppointments(files[0], semestersMap);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        checkForPresentAppointments(file, semestersMap);
    };


    return (
        <div>
            <div
                ref={dropRef}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{
                    border: '2px dashed #ccc',
                    borderRadius: '4px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer'
                }}
            >
                <input
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="fileInput"
                    accept=".json, .xlsx"
                />
                <label htmlFor="fileInput">
                    {file ? `File: ${file.name}` : 'Drop a JSON / XLSX file here or click to select.'}
                </label>
            </div>
            {UploadAlertDialog(openUploadAlertDialog, setOpenUploadAlertDialog,
                setWelcomeDialogOpen, handleOpenGroupingDialog, handleChange, readFile)}

        </div>
    );

    function transformDataToBuiltModules(importData) {
        if (!importData || !importData.semestersMap) {
            return []
        }

        const { semestersMap } = importData
        const builtModules = []

        Object.keys(semestersMap).forEach((semesterID) => {
            const semesterModules = semestersMap[semesterID]

            Object.keys(semesterModules).forEach((modName) => {
                const rawModule = semesterModules[modName]

                // Helper to convert "raw" appointments into "built" appointments
                const convertAppointments = (rawAppointments) => {
                    return (rawAppointments || []).map((a) => {
                        // Convert strings to Date, etc.
                        //use functions buildAppointment (see mostafa :D)
                        const start = a.start ? new Date(a.start) : new Date()
                        const end = a.end ? new Date(a.end) : new Date()
                        const seriesStart = a.seriesStart ? new Date(a.seriesStart) : start
                        const seriesEnd = a.seriesEnd ? new Date(a.seriesEnd) : end

                        return buildAppointment(
                            a.module || modName,          // module name
                            a.title || 'No Title',        // title
                            start,                        // start
                            end,                          // end
                            a.type || 100,                // type
                            a.rhythm || 0,                // rhythm
                            seriesStart,
                            seriesEnd,
                            a.allDay || false,
                            (typeof a.isDraggable === 'boolean') ? a.isDraggable : true,
                            a.lecturer || '',
                            a.room || '',
                            a.participants || 0
                        )
                    })
                }

                const lectures = convertAppointments(rawModule.lectures)
                const tutorials = convertAppointments(rawModule.tutorials)
                const exams = convertAppointments(rawModule.exams)
                const others = convertAppointments(rawModule.others)

                // Build the module object
                const built = buildModule(
                    rawModule.semesterID,
                    rawModule.LV,
                    rawModule.title,
                    rawModule.level,
                    rawModule.fixed,
                    rawModule.optional,
                    rawModule.rhythm,
                    rawModule.faculty,
                    rawModule.responsibleInstructor,
                    rawModule.numberOfParticipants,
                    lectures,
                    tutorials,
                    exams,
                    others
                )

                builtModules.push(built)
            })
        })

        return builtModules
    }

    function parseTerm(termString) {
        const year = termString.match(/\d+/)[0]; // "2024"
        return termString.toLowerCase().includes("sose")
            ? "SoSe" + year
            : "WiSe" + year;
    }

    function transformDataToBuiltModulesFromXLSXJson(importData) {
        if (!Array.isArray(importData)) return [];

        const modulesMap = new Map();

        const categorizeType = (type) => {
            const normalized = type?.toLowerCase() || "";
            if (normalized.includes("übung") || normalized.includes("tutorial")) return "tutorials";
            if (normalized.includes("klausur") || normalized.includes("exam")) return "exams";
            if (normalized.includes("vorlesung") || normalized.includes("lecture")) return "lectures";
            return "others";
        };

        const parseDate = (dateStr, timeStr) => {
            if (!dateStr || !timeStr) return new Date();
            return new Date(`${dateStr}T${timeStr}:00`);
        };

        const generateAppointment = (entry, moduleName, type) => {
            const start = parseDate(entry["Datum von"], entry["von"]);
            const end = parseDate(entry["Datum bis"], entry["bis"]);

            return {
                module: moduleName,
                title: entry["Veranstaltungsart"] || "Untitled",
                start,
                end,
                type: {
                    "lecture": 10,
                    "tutorial": 20,
                    "exam": 30,
                    "others": 100
                }[type] || 100,
                rhythm: entry["Rhyth."] || 0,
                seriesStart: start,
                seriesEnd: end,
                allDay: false,
                isDraggable: true,
                lecturer: entry.verantwortlicher || "",
                room: entry.Raum || "",
                participants: 0,
                id: Math.floor(Math.random() * 100000) // You can replace this with an actual ID generator
            };
        };

        importData.forEach((entry) => {
            const moduleKey = `${entry.term}-${entry.Nummer}`;
            const typeKey = categorizeType(entry["Veranstaltungsart"]);
            const moduleName = entry.Drucktext || "No Module";
            const parsedTerm = parseTerm(entry.term);
            //console.log("parsedTerm", parsedTerm);

            if (!modulesMap.has(moduleKey)) {
                modulesMap.set(moduleKey, {
                    semesterID: parsedTerm,
                    LV: entry.Nummer || "LV-unknown",
                    title: moduleName,
                    level: entry["PG"] || "unknown",
                    fixed: false,
                    optional: true,
                    rhythm: entry["Rhyth."] || 2,
                    faculty: "FB12",
                    responsibleInstructor: entry.verantwortlicher || "unknown",
                    numberOfParticipants: 0,
                    lectures: [],
                    tutorials: [],
                    exams: [],
                    others: []
                });
            }

            const module = modulesMap.get(moduleKey);
            const appointment = generateAppointment(entry, moduleName, typeKey);
            module[typeKey].push(appointment);
        });

        return Array.from(modulesMap.values());
    }




    //change it Mostafa
    // download the file to txt format
    function readFile(file, secondUndo) {
        console.log("readFile -> file:", file)

        const getExtension = (filename) => filename?.split('.').pop().toLowerCase()
        const fileReader = new FileReader()

        fileReader.onload = () => {
            let importData = null

            // Decide if JSON or XLSX
            if (getExtension(file.name) === 'json') {
                // Parse JSON
                try {
                    importData = JSON.parse(fileReader.result)
                    console.log("Parsed JSON data:", importData)
                } catch (error) {
                    console.error('Error parsing JSON file:', error)
                    showAlertMessage('error', 'Error parsing JSON in file!')
                    return
                }
            } else {
                // Parse XLSX
                try {
                    const data = new Uint8Array(fileReader.result)
                    const workbook = XLSX.read(data, { type: 'array' })
                    const firstSheetName = workbook.SheetNames[0]
                    const worksheet = workbook.Sheets[firstSheetName]

                    // Convert the sheet data to an array of objects
                    const xlsxData = XLSX.utils.sheet_to_json(worksheet)
                    console.log("Parsed XLSX data:", xlsxData)

                    // If you want to store it in the same structure as your big JSON, 
                    // you'd transform xlsxData into { semestersMap, ... } etc.
                    // For now, let's assume xlsxData is directly shaped like your big "importData"
                    importData = {
                        semestersMap: {},
                        // or your own structure
                        xlsxRaw: xlsxData
                    }
                } catch (err) {
                    console.error('Error parsing XLSX file:', err)
                    showAlertMessage('error', 'Error parsing XLSX file!')
                    return
                }
            }

            // If we have importData, do the transform + import
            if (importData) {
                // 1) Turn the raw JSON into built modules
                let builtModules = [];
                if (getExtension(file.name) === 'json') {
                    builtModules = transformDataToBuiltModules(importData)
                } else {
                    builtModules = transformDataToBuiltModulesFromXLSXJson(importData.xlsxRaw);
                    let allLecturers = new Set();
                    let allRooms = new Set();

                    for (const mod of builtModules) {
                        for (const arr of [mod.lectures, mod.tutorials, mod.exams, mod.others]) {
                            for (const apt of arr) {
                                if (apt.lecturer) allLecturers.add(apt.lecturer);
                                if (apt.room) allRooms.add(apt.room);
                            }
                        }
                    }
                    setLecturers(prev => {
                        const merged = new Set([...prev, ...allLecturers]);
                        return Array.from(merged);
                    });

                    setRooms(prev => {
                        const merged = new Set([...prev, ...allRooms]);
                        return Array.from(merged);
                    });
                    //console.log("builtModules", builtModules); // Uncommented for debugging

                }
                console.log("builtModules", builtModules);
                // 2) Import each built module
                // builtModules.forEach((m, I) => {
                //     console.log("importModule!!!!!", m, I);

                //     importModule(m, setLecturers, setRooms, handleChange)
                // })
                const modulesToImport = [...builtModules];
                if (getExtension(file.name) === 'json') {
                    handleChange(
                        "addMultipleModules",
                        modulesToImport,         // pass the entire array
                        false,
                        null,                    // you can pass null or a dummy semester 
                        null                     // likewise for module
                    );
                }
                else {
                    handleChange(
                        "addMultipleModules",
                        builtModules,
                        false,               // secondUndo
                        0,                   // semesterID (unused in this case)
                        "No Module"          // module (unused in this case)
                    );
                }

                // Show a success message
                const countModules = builtModules.length
                showAlertMessage('success', `Successfully imported ${countModules} modules!`)
                setDropFieldIsVisible(!developerMode ? false : true)
            }
        }

        // Actually read the file
        if (getExtension(file?.name) === 'json') {
            fileReader.readAsText(file)
        } else {
            console.log("file.name", getExtension(file?.name));

            fileReader.readAsArrayBuffer(file)
        }
    }


    function checkForPresentAppointments(file, semestersMap) {
        console.log("checkForPresentAppointments", file, semestersMap)
        if (Object.keys(semestersMap).length > 0) {
            console.log("semester present")
            setFile4(file)
            setOpenUploadAlertDialog(true)
        } else {
            // No existing semester data
            readFile(file, false)
            handleDialogs(setOpenUploadAlertDialog, setWelcomeDialogOpen, handleOpenGroupingDialog)
        }
    }


    function UploadAlertDialog(
        openUploadAlertDialog,
        setOpenUploadAlertDialog,
        setWelcomeDialogOpen,
        handleOpenGroupingDialog,
        handleChange,
        readFile
    ) {
        const handleClose = () => {
            console.log("Cancel upload.")
            setOpenUploadAlertDialog(false)
        }

        const handleReplace = () => {
            console.log("Replacing appointments.")
            handleChange("deleteAll", [], false, 0, "")
            // file4 is in closure above, so we rely on that reference
            readFile(file4, true)
            handleDialogs(setOpenUploadAlertDialog, setWelcomeDialogOpen, handleOpenGroupingDialog)
        }
        const handleAdd = () => {
            console.log("Adding appointments.")
            readFile(file4, false)
            handleDialogs(setOpenUploadAlertDialog, setWelcomeDialogOpen, handleOpenGroupingDialog)
        }

        return (
            <Fragment>
                <Dialog
                    open={openUploadAlertDialog}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Warning: Appointments already exist!"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Do you want to add the new appointments? Or do you want to replace the old ones?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleReplace}>Replace</Button>
                        <Button onClick={handleAdd} autoFocus>
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }

};

function handleDialogs(setOpenUploadAlertDialog, setWelcomeDialogOpen, handleOpenGroupingDialog) {
    setOpenUploadAlertDialog(false)
    setWelcomeDialogOpen(false)
    handleOpenGroupingDialog("Modules")
}


// Appointment structure
// appointment = {
//     module: String,
//     title: String,
//     start: Date,
//     end: Date,
//     type: Number,
//     rhythm: Number,
//     seriesStart: Date,
//     seriesEnd: Date,
//     allDay: Boolean,
//     isDraggable: Boolean,
//     lecturer: String,
//     room: String,
//     participants: Number,
//   }

//buildAppointment--->buildModule--->importModule
//mostafa work on this and improve it
export function buildAppointment(module, title, start, end, type, rhythm, seriesStart, seriesEnd, allDay, isDraggable, lecturer, room, participants) {
    // Todo: Increase error counter, when something is wrong
    module = (isUndefined(module) || typeof module !== 'string') ? "No Module" : module
    title = (isUndefined(title) || typeof title !== 'string') ? "No Title" : title
    start = (isUndefined(start) || typeof start !== 'object') ? new Date() : start
    end = (isUndefined(end) || typeof end !== 'object') ? new Date() : end
    type = (isUndefined(type) || typeof type !== 'number') ? 100 : type
    rhythm = (isUndefined(rhythm) || typeof rhythm !== 'number') ? 0 : rhythm
    seriesStart = (isUndefined(seriesStart) || typeof seriesStart !== 'object') ? new Date(start) : seriesStart
    seriesEnd = (isUndefined(seriesEnd) || typeof seriesEnd !== 'object') ? new Date(end) : seriesEnd
    allDay = (isUndefined(allDay) || typeof allDay !== 'boolean') ? false : allDay
    isDraggable = (isUndefined(isDraggable) || typeof isDraggable !== 'boolean') ? true : isDraggable
    lecturer = (isUndefined(lecturer) || typeof lecturer !== 'string') ? "" : lecturer
    room = (isUndefined(room) || typeof room !== 'string') ? "" : room
    participants = (isUndefined(participants) || typeof participants !== 'number') ? 0 : participants

    return {
        module,
        title,
        start,
        end,
        type,
        rhythm,
        seriesStart,
        seriesEnd,
        allDay,
        isDraggable,
        lecturer,
        room,
        participants
    }
}


export function buildModule(semesterID, LV, title,
    level, fixed, optional, rhythm, faculty, responsibleInstructor, numberOfParticipants,
    lectures, tutorials, exams, others
) {
    const newLocal = {
        semesterID,
        LV,
        title,
        level,
        fixed,
        optional,
        rhythm,
        faculty,
        responsibleInstructor,
        numberOfParticipants,
        lectures,
        tutorials,
        exams,
        others
    };
    // console.log("buildModule", newLocal)
    return newLocal
}

// Work with this for file import --> Mostafa
// In order to make sure a module has the right structure, please use the functions buildAppointment() and buildModule().
// When the same module is imported, it is added incrementing the module title. It is not merged.
export function importModule(module, setLecturers, setRooms, handleChange) {
    // Todo: storeUndoData()
    // console.log("importModule here1", module)

    setLecturers((prev) => {
        let newLecturers = new Set(prev)
        findNewLecturers(module.lectures)
        findNewLecturers(module.tutorials)
        findNewLecturers(module.exams)
        findNewLecturers(module.others)
        function findNewLecturers(array) {
            for (const a of array) {
                if (!isUndefined(a.lecturer)) {
                    newLecturers.add(a.lecturer)
                }
            };
        }
        return Array.from(newLecturers)
    })

    setRooms((prev) => {
        let newRooms = new Set(prev)
        findNewRooms(module.lectures)
        findNewRooms(module.tutorials)
        findNewRooms(module.exams)
        findNewRooms(module.others)
        function findNewRooms(array) {
            for (const a of array) {
                if (!isUndefined(a.room)) {
                    newRooms.add(a.room)
                }
            };
        }
        return Array.from(newRooms)
    })

    handleChange("addModule", module, false,
        module.semesterID,
        module.title)
}

export function addMaxIDsAndModuleName(maxId, moduleName, lectures, tutorials, exams, others) {
    // console.log("addMaxIDs")
    let newMaxID = maxId;
    const addId = a => {
        newMaxID = newMaxID + 1;
        return ({ ...a, id: newMaxID, module: moduleName });
    };
    lectures = lectures.map(addId);
    tutorials = tutorials.map(addId);
    exams = exams.map(addId);
    others = others.map(addId);
    // console.log("end")
    return { newMaxID, lectures, tutorials, exams, others };
}

// This is merging old appointments and modules with new ones
export function importItems(
    semestersMap, semesterID, moduleTitle,
    lectures,
    tutorials,
    exams,
    others,
    importToCondensedWeek
) {
    // console.log("importItems", semesterID, moduleTitle, semestersMap)
    let resultSemestersMap = checkIfSemesterAndModuleExist(semestersMap, semesterID, moduleTitle);
    // console.log("tmp", tmp)
    // Todo: Check if the following is added with the first entry.
    // prev[semesterID][moduleTitle]["lecturer"] = responsibleInstructor
    // prev[semesterID][moduleTitle]["level"] = level
    // prev[semesterID][moduleTitle]["fixed"] = fixed
    // prev[semesterID][moduleTitle]["optional"] = optional
    // prev[semesterID][moduleTitle]["faculty"] = faculty
    // prev[semesterID][moduleTitle]["participants"] = numberOfParticipants

    resultSemestersMap[semesterID][moduleTitle]["lectures"] = [
        ...resultSemestersMap[semesterID][moduleTitle]["lectures"],
        ...moveAppointmentsToCondensedWeek(lectures, semesterID, importToCondensedWeek)
    ];
    resultSemestersMap[semesterID][moduleTitle]["tutorials"] = [
        ...resultSemestersMap[semesterID][moduleTitle]["tutorials"],
        ...moveAppointmentsToCondensedWeek(tutorials, semesterID, importToCondensedWeek)
    ];
    resultSemestersMap[semesterID][moduleTitle]["exams"] = [
        ...resultSemestersMap[semesterID][moduleTitle]["exams"],
        ...exams
    ];
    resultSemestersMap[semesterID][moduleTitle]["others"] = [
        ...resultSemestersMap[semesterID][moduleTitle]["others"],
        ...moveAppointmentsToCondensedWeek(others, semesterID, importToCondensedWeek)
    ];
    return resultSemestersMap;
}
