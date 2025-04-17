//////////////////////////////////////////////
//// Grouping dialog

import React, { useState, useEffect } from 'react'

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import TerminalIcon from '@mui/icons-material/Terminal';
import Alert from '@mui/material/Alert';
import { Tooltip } from '@mui/material';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Checkbox from '@mui/material/Checkbox';

// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../../../../src/addons/dragAndDrop/styles.scss'

import { mapType, mapRhythm, mapSemesterIDtoString, getSemesterIDfromString } from '../../tools/functions'
import { getModules } from '../../dataDisplay/getData';
import { calculateRows } from './dataManagementFunctions';
import { SemesterPicker } from '../../userInteraction/components';
import CollapsibleTable from './CollapsibleTable';
import { buildAppointment, buildModule } from '../dataImport';




const groupings = [
    'Semesters',
    'Periods',
    'Studyplans',
    'Modules',
    'Lecturers',
    'Rooms',
    'Types',
];

export function GroupingDialog(currentSemesterID, setOpenGroupingRename,
    openGroupingDialog, handleOpenGroupingDialog, setDrawerOpen, setOpenSettingsDrawer, setOpenFilterDrawer,
    grouping, setModifyStudyPlan, visibleDate, setVisibleDate, openAlertDialog,
    semestersMap, setOpenGroupingDialog, updateEditingView,
    showAlert, setShowAlert, alertSeverity, alertMessage, handleChange, setNewName, setOldName,
    setOpenStudyplansDialog, studyplans, lecturers, rooms,
    setOpenSemestersDialog, rows, setRows, momentYear, setYear, semester, setSemester,
    setChangeType, setOldSemester, deleteObject
) {

    const [currentSemesterID2, setCurrentSemesterID2] = useState(currentSemesterID)
    const [lastGrouping, setLastGrouping] = useState("Objects") // Only to make sure, that rows is updated.
    // console.log("grouping", grouping) // Todo: Why called so many times, although the dialog is not open?
    useEffect(() => {
        if (openGroupingDialog) {
            // console.log("GroupingDialog - useEffect()", grouping, year, semester)
            const year2 = momentYear.year()
            let currentSemesterID3
            if (semester.startsWith("S")) {
                currentSemesterID3 = year2 * 10; // Todo: 'year' and 'semester' should be updated when 'visibleDate' changes.
            } else {
                currentSemesterID3 = year2 * 10 + 1;
            }
            setCurrentSemesterID2(currentSemesterID3)
            setRows(calculateRows(grouping, currentSemesterID3, semestersMap, studyplans, lecturers, rooms)) // Todo: getSemester??? //  Todo: Why is rows not updated quickly enough?
            setNewName("New " + grouping.substring(0, grouping.length - 1))
            setLastGrouping(grouping)
        }
    }, [grouping, momentYear, semester, semestersMap, studyplans, lecturers, rooms, openGroupingDialog])




    const addNewObject = () => {
        switch (grouping) {
            case "Semesters":
                setChangeType("addSemester")
                setOpenSemestersDialog(true)
                break
            case "Periods":
                // Plus icon has been deactivated.
                break
            case "Studyplans":
                setOldName("##xy8e%3-neverToBeFound-j$3j@je9K")
                setModifyStudyPlan(false)
                setOpenStudyplansDialog(true)
                break
            case "Modules":
            case "Lecturers":
            case "Rooms":
                setOldName("##xy8e%3-neverToBeFound-j$3j@je9K"); setOpenGroupingRename(true)
                break
            case "Types":
                console.log("To be implemented")
                break
            default:
                console.error("Grouping not available #2", grouping)
        }
    }


    const addDefaultObject = (name) => {
        console.log("addDefaultObject", name)
        const defaultAppointment = {
            module: "No Module",
            title: "New Lecture",
            start: new Date(new Date(visibleDate).setHours(8, 15)),
            end: new Date(new Date(visibleDate).setHours(9, 45)),
            rhythm: 0,
            allDay: false,
            isDraggable: true,
            type: 10,
        }
        // console.log("defaultAppointment", studyplans, studyplans[studyPlanTitle], grouping)
        switch (grouping) {
            case "Semesters":
                handleChange("addModule", buildModule(
                    getSemesterIDfromString(name), "LV-unknown", "New empty module", "unknown",
                    false, true, 2, "FB12", "unknown", 0,
                    [], [], [], []
                ), false, getSemesterIDfromString(name), "")
                break
            case "Studyplans":
                console.warn("Todo: addDefaultObject to studyplans")
                // let tmp = {};
                // tmp[studyPlanTitle] = {
                //   modules: [{
                //     title: "Default Module",
                //     type: "Basismodul",
                //     lecturer: "Prof. Dr. Supervisor"
                //   }]
                // }
                // handleChange("addModulesToStudyplan", tmp, false, 0, "Studyplans")
                break
            case "Modules":
                handleChange("add", { ...defaultAppointment, module: name }, false, currentSemesterID2, name)
                break
            case "Lecturers":
                handleChange("add", { ...defaultAppointment, lecturer: name }, false, currentSemesterID2, "No Module")
                break
            case "Periods":
                // No periods should be added, because of the program logic.          
                break
            case "Rooms":
                handleChange("add", { ...defaultAppointment, room: name }, false, currentSemesterID2, "No Module")
                break
            case "Types":
                handleChange("add", { ...defaultAppointment, type: mapType(name) }, false, currentSemesterID2, "No Module")
                break
            default:
                console.error("Grouping not available #5", grouping)
        }

    }

    const editObject = (o) => {
        return () => {
            switch (grouping) {
                case "Semesters":
                    editModuleOpen(o);
                    break
                case "Studyplans":
                    console.warn("Todo: Edit studyplan module is to be implemented")
                    break
                case "Modules":
                case "Lecturers":
                case "Rooms":
                case "Types":
                case "Periods":
                    updateEditingView(o)
                    break
                default:
                    console.error("Grouping not available #5", grouping)
            }
            setOpenGroupingDialog(false)
            setOpenFilterDrawer(false)
            setOpenSettingsDrawer(false)
            setDrawerOpen(true)
        }
    }


    const copyObject = (o) => {
        console.log("copyObject", o)
        switch (grouping) {
            case "Semesters":
                copyModule(o);
                break
            case "Studyplans":
                console.warn("Todo: Copy studyplan module")
                // let tmp = {};
                // tmp[studyPlanTitle] = {
                //   modules: [{
                //     title: "Default Module",
                //     type: "Basismodul",
                //     lecturer: "Prof. Dr. Supervisor"
                //   }]
                // }
                // handleChange("addModulesToStudyplan", tmp, false, 0, "Studyplans")
                break
            case "Modules":
            case "Lecturers":
            case "Rooms":
            case "Types":
                handleChange("add", { ...o, title: (o.title + " copy") }, false, currentSemesterID2, o.module)
                break
            case "Periods":
                // Periods cannot be copied.          
                break
            default:
                console.error("Grouping not available #5", grouping)
        }
    }


    const selectGrouping = (s) => {
        const group = s.target.value;
        setNewName("New " + group.substring(0, group.length - 1));
        handleOpenGroupingDialog(group);
    }

    const showGroupingInConsole = () => {
        console.log("Displayed grouping", rows)

        switch (grouping) {
            case "Semesters":
                console.log("Semesters", Object.keys(semestersMap));
                break;
            case "Studyplans":
                console.log("Studyplans", studyplans);
                break;
            case "Modules":
                console.log("Modules", getModules(semestersMap[currentSemesterID2]));
                break;
            case "Lecturers":
                console.log("Lecturers", lecturers);
                break;
            case "Rooms":
                console.log("Rooms", rooms);
                break;
            case "Periods":
                console.log("Periods", semestersMap[currentSemesterID2] ? semestersMap[currentSemesterID2]["Periods"] : "Semester not available.");
                break;
            case "Types":
                console.log("Types", ["Lecture", "Tutorial", "Exam", "Seminar", "Block", "Period", "Other", "...?"]);
                break;
            default:
                console.error("Grouping not available #3", grouping);
        }
    }

    const copyGrouping = (name) => {
        return () => {
            const copiedName = name + " copy"
            let copiedAppointments

            switch (grouping) {
                case "Semesters":
                case "Periods":
                    setChangeType("copySemester")
                    setOldSemester(name)
                    setOpenSemestersDialog(true)
                    break
                case "Studyplans":
                    console.log("studyplans[name]", studyplans[name])
                    let copiedStudyplan = {}
                    copiedStudyplan[copiedName] = studyplans[name]
                    handleChange("addStudyplan", copiedStudyplan, false, 0, "Studyplans")
                    break
                case "Modules":
                    copyModule(semestersMap[currentSemesterID2][name])
                    break
                case "Lecturers":
                    // Todo
                    // copiedAppointments = appointments.filter(b => b.lecturer === name).map(b => {
                    //   newMaxID = newMaxID + 1
                    //   return { ...b, id: newMaxID, lecturer: copiedName }
                    // })
                    // handleChange("addLecturer", copiedName, false, true, 0, "Lecturer")
                    // handleChange("addMany", copiedAppointments, true, currentSemesterID, currentModule)
                    break
                case "Rooms":
                    // Todo
                    // copiedAppointments = appointments.filter(b => b.room === name).map(b => {
                    //   newMaxID = newMaxID + 1
                    //   return { ...b, id: newMaxID, room: copiedName }
                    // })
                    // handleChange("addRoom", copiedName, false, 0, "Rooms")
                    // handleChange("addMany", copiedAppointments, true, currentSemesterID, currentModule)
                    break
                case "Types":
                    // Todo
                    break
                default:
                    console.error("Grouping not available #4", grouping)
            }

        }
    }

    const editGrouping = (name, grouping) => {
        return () => {
            setOldName(name)
            setNewName(name)
            switch (grouping) {
                case "Semesters":
                case "Periods":
                    setChangeType("moveSemester")
                    setOldSemester(name)
                    setOpenSemestersDialog(true)
                    break
                case "Studyplans":
                    setStudyPlanTitle(name)
                    setModifyStudyPlan(true)
                    setOpenStudyplansDialog(true)
                    break
                case "Modules":
                    editModuleOpen(semestersMap[currentSemesterID2][name])
                    break
                case "Lecturers":
                case "Rooms":
                    setOpenGroupingRename(true)
                    break
                case "Types":
                    // Todo
                    break
                default:
                    console.error("Grouping not available #7", grouping)
            }
        }
    }

    const deleteGrouping = (name) => {
        return () => {
            switch (grouping) {
                case "Semesters":
                case "Periods":
                    handleChange("deleteSemester", name, false, 0, "")
                    break
                case "Studyplans":
                    handleChange("deleteStudyplan", name, false, 0, "Studyplans")
                    break
                case "Modules":
                    openAlertDialog(("Are you sure to delete the module '" + name + "'? All it's appointments will be deleted, too!"),
                        "Cancel",
                        "Delete",
                        () => {
                            handleChange("deleteModule", name, false, currentSemesterID2, name)
                        }
                    )
                    break
                case "Lecturers":
                    openAlertDialog(("Lecturer '" + name + "' will only be deleted from list, not from appointments. For this you have to remove or edit the appointments."),
                        "Cancel",
                        "Delete",
                        () => { handleChange("deleteLecturer", name, false, currentSemesterID2, "unneeded") }
                    )
                    break
                case "Rooms":
                    openAlertDialog(("Room '" + name + "' will only be deleted from list, not from appointments. For this you have to remove or edit the appointments."),
                        "Cancel",
                        "Delete",
                        () => { handleChange("deleteRoom", name, false, 0, "Rooms") }
                    )
                    break
                case "Types":
                    // Todo
                    break
                default:
                    console.error("Grouping not available #6", grouping)
            }
        }
    }


    return (
        <div>
            <Dialog
                open={openGroupingDialog}
                onClose={() => setOpenGroupingDialog(false)}
                fullWidth
                maxWidth="xl"
                PaperProps={{
                    component: 'form',
                    style: { width: '1250px', height: '800px' },
                    onSubmit: (event) => {
                        event.preventDefault();
                    },
                }}
            >
                <DialogTitle>
                    <div style={{ display: 'flex', alignItems: 'center' }}>

                        <div>
                            <Tooltip title="Show only active items">
                                <Checkbox
                                    // Todo: Maybe better use Switch
                                    defaultChecked
                                    // checked={draggable}
                                    // inputProps={{ 'aria-label': 'controlled' }}
                                    onChange={(event) => { console.log("To be implemented", event.target.value, event) }}
                                />
                            </Tooltip>
                        </div>

                        <div>
                            {grouping}{(grouping === "Modules") && (" of " + mapSemesterIDtoString(currentSemesterID2))}
                        </div>

                        <div style={{ marginLeft: 'auto' }}>
                            {(grouping === "Modules") && SemesterPicker(momentYear, setYear, semester, setSemester)}
                        </div>

                        {(grouping === "Modules") &&
                            <div>
                                <Tooltip title="Refresh calendar">
                                    <IconButton color="inherit" onClick={() => { setVisibleDate(new Date(momentYear.year(), (semester.startsWith("S") ? 3 : 9), 7)) }}>
                                        <RefreshIcon fontSize='large' />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        }

                        <div>
                            <Tooltip title={"Show grouping in console"}>
                                <IconButton sx={{ ml: 1, mr: 1.5 }} color="inherit" onClick={() => showGroupingInConsole()}>
                                    <TerminalIcon fontSize='large' />
                                </IconButton>
                            </Tooltip>
                        </div>

                        <div>
                            <FormControl sx={{ width: 128 }} >
                                <InputLabel id="grouping-select-label">Select</InputLabel>
                                <Select
                                    labelId="grouping-select-label"
                                    id="grouping-select"
                                    value={grouping}
                                    label="Select2"
                                    name="groupings"
                                    onChange={(s) => selectGrouping(s)}
                                >
                                    {groupings.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        {grouping !== "Periods" && grouping !== "Types" && <div style={{ marginRight: '3px' }}>
                            <Tooltip title={"Add " + grouping.substring(0, grouping.length - 1)}>
                                <IconButton sx={{ ml: 1 }} color="inherit" onClick={addNewObject}>
                                    <AddIcon name="DialogAddIcon" fontSize='large' />
                                </IconButton>
                            </Tooltip>
                        </div>}

                    </div>
                    {showAlert && (
                        <div>
                            <Alert color={alertSeverity} severity={alertSeverity} onClose={() => setShowAlert(false)}>
                                {alertMessage}
                                {/* ; Todo: Test all colors */}
                            </Alert>
                        </div>
                    )}

                </DialogTitle>

                <DialogContent>
                    {/* <DialogContentText>
                  Here you can manage modules.
                </DialogContentText> */}

                    {/*  <Divider sx={{ mt: marginTop, mb: marginTop }} /> */}

                    {CollapsibleTable(
                        rows,
                        lastGrouping,
                        addDefaultObject, editObject, copyObject, deleteObject,
                        copyGrouping, editGrouping, deleteGrouping
                    )}

                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenGroupingDialog(false)}>Close</Button>
                    {/* <Button onClick={() => setOpenModuleDialog(false)}>Save</Button> */}

                </DialogActions>
            </Dialog>
        </div>
    );

    function copyModule(o) {
        setChangeType("copyModule");
        setOldSemester(o);
        setOpenSemestersDialog(true);
    }

    function editModuleOpen(o) {
        if (o.lectures.find(a => true)) {
            updateEditingView(o.lectures.find(a => true));
        } else if (o.tutorials.find(a => true)) {
            updateEditingView(o.tutorials.find(a => true));
        } else if (o.exams.find(a => true)) {
            updateEditingView(o.exams.find(a => true));
        } else if (o.others.find(a => true)) {
            updateEditingView(o.others.find(a => true));
        } else {
            updateEditingView(buildAppointment(o.title, "", new Date(), new Date(), 10, 7, new Date(), new Date(), false, true, "", "", 0));
        }
        setOpenGroupingDialog(false)
        setDrawerOpen(true)
    }
}