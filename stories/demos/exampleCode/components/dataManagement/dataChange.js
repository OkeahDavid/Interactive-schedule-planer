import { isUndefined, lowerCase } from 'lodash'

// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../../../src/addons/dragAndDrop/styles.scss'

import { mapType, getSemesterIDfromString, moveAppointmentDates, moveAppointmentsToCondensedWeek } from '../tools/functions'
import { getWeekDayYearDifference, noPeriodDefault } from '../settings/settings'
import { addMaxIDsAndModuleName, buildModule, importItems } from './dataImport'



export function change(type, modified, secondUndo, clearRedo, semesterID, module, processFilter,
    setSemestersMap, undoStack, setUndoStack, setRedoStack, warnSwitch, undoNumber,
    setStudyplans, setCurrentModule, visibleDate,
    setAnalyzeAllConflicts, setSelected, setLecturers, setRooms,
    setModulesInSameSemesterMap, setPreviousYearConflictMap, setNextYearConflictMap, updateEditingView, setVisibleAppointments
) {
    if (clearRedo) setRedoStack([])
    console.log(type, secondUndo, clearRedo, semesterID, module, modified)
    // Todo: When to transfer to condensed week?
    // Todo: Maybe add id only in here?
    switch (type) {
        case "add":
            storeUndoData(type, modified, secondUndo, undoStack, setUndoStack, warnSwitch, undoNumber)
            setSemestersMap(prev => {
                let tmp = checkIfSemesterAndModuleExist(prev, semesterID, module)
                let appointmentType = (lowerCase(mapType(modified.type > 30 ? 100 : modified.type)) + "s")
                const newAppointment = { ...modified, id: tmp.maxID + 1 }
                updateEditingView(newAppointment);
                
                // Create the updated state
                const updatedState = {
                    ...tmp,
                    [semesterID]: {
                        ...tmp[semesterID],
                        [module]: {
                            ...tmp[semesterID][module],
                            [appointmentType]: [...tmp[semesterID][module][appointmentType], newAppointment]
                        }
                    },
                    maxID: tmp.maxID + 1
                };
                
                // Process filter directly with the complete updated state
                processFilter(updatedState, modified.start, newAppointment, "add")
                return updatedState
            })
            break;
        case "addMany":
            if (modified.length > 0) {
                storeUndoData(type, modified, secondUndo, undoStack, setUndoStack, warnSwitch, undoNumber)
                setSemestersMap(prev => {
                    let newMaxID = prev.maxID
                    let tmp = checkIfSemesterAndModuleExist(prev, semesterID, module)
                    // Todo: Is function pure?
                    for (const a of modified) {
                        let appointmentType = lowerCase(mapType(a.type > 30 ? 100 : a.type)) + "s"
                        const newAppointment = { ...a, id: newMaxID + 1 }
                        updateEditingView(newAppointment);
                        tmp = {
                            ...tmp,
                            [semesterID]: {
                                ...tmp[semesterID],
                                [module]: {
                                    ...tmp[semesterID][module],
                                    [appointmentType]: [...tmp[semesterID][module][appointmentType], newAppointment]
                                }
                            }
                        }
                        newMaxID = newMaxID + 1
                    }

                    // console.log("semestersMap[" + semesterID + "][" + module + "]", tmp[semesterID][module])
                    processFilter(tmp, modified[0].start, modified[0])
                    return { ...tmp, maxID: newMaxID }
                })


            }
            break;
        case "replace":
            // setAppointments((prev) => { // Todo: storeUndoData
            storeUndoData(type,
                // prev.filter(a => modified.find(b => b.id === a.id)) ? true : false
                false
                , secondUndo)
            //   const newReplace = prev.map(a => {
            //     const tmp = modified.find(b => b.id === a.id)
            //     if (tmp) {
            //       return tmp
            //     } else {
            //       return a
            //     }
            //   })
            //   processFilter2ReplaceAll(newReplace)
            //   return newReplace
            // })
            setSemestersMap(prev => {
                let tmp = checkIfSemesterAndModuleExist(prev, semesterID, modified.module)
                // console.warn("Called two times? Function not pure?") // Todo?
                let appointmentType = (lowerCase(mapType(modified.type > 30 ? 100 : modified.type)) + "s")
                if (modified.module !== module) {
                    console.log("Step 2a", modified.title, modified.start, modified.end, modified)
                    tmp = {
                        ...tmp,
                        [semesterID]: {
                            ...tmp[semesterID],
                            [module]: {
                                ...tmp[semesterID][module],
                                [appointmentType]: tmp[semesterID][module][appointmentType].filter(b => b.id !== modified.id)
                            },
                            [modified.module]: {
                                ...tmp[semesterID][modified.module],
                                [appointmentType]: [...tmp[semesterID][modified.module][appointmentType], modified]
                            }
                        }
                    }
                } else {
                    console.log("Step 2b", modified.title, modified.module, modified.start, modified.end, modified)
                    tmp = {
                        ...tmp,
                        [semesterID]: {
                            ...tmp[semesterID],
                            [module]: {
                                ...tmp[semesterID][module],
                                [appointmentType]: tmp[semesterID][module][appointmentType].map(b => b.id === modified.id ? modified : b)
                            }
                        }
                    }
                }
                // console.log("semestersMap[" + semesterID + "][" + modified.module + "]", tmp[semesterID][modified.module], "Old module: " + module)
                console.log("Step 2c")
                processFilter(tmp, modified.start, modified)
                return tmp
            })
            break;
        case "replaceMany":
            // setAppointments((prev) => { // Todo: storeUndoData
            storeUndoData(type,
                //  prev.filter(a => modified.find(b => b.id === a.id)) ? true : false
                false
                , secondUndo)
            //   const newReplace = prev.map(a => {
            //     const tmp = modified.find(b => b.id === a.id)
            //     if (tmp) {
            //       return tmp
            //     } else {
            //       return a
            //     }
            //   })
            //   processFilter2ReplaceAll(newReplace)
            //   return newReplace
            // })
            setSemestersMap(prev => {
                for (const a of modified) {
                    checkIfSemesterAndModuleExist(prev, semesterID, a.module)
                    // Todo: Delete in old module, if at all this is a case.      
                    if (a.module !== module) {
                        console.log("Step 2a", a.title, a.start, a.end, a)
                        switch (a.type) {
                            case 10:
                                prev[semesterID][a.module]["lectures"] = [...prev[semesterID][a.module]["lectures"], a]  // Todo: Do I need to reassign it or can I just push?
                                break
                            case 20:
                                prev[semesterID][a.module]["tutorials"] = [...prev[semesterID][a.module]["tutorials"], a]
                                break
                            case 30:
                                prev[semesterID][a.module]["exams"] = [...prev[semesterID][a.module]["exams"], a]
                                break
                            default:
                                prev[semesterID][a.module]["others"] = [...prev[semesterID][a.module]["others"], a]
                        }
                    } else {
                        console.log("Step 2b", a.title, a.module, a.start, a.end, a)
                        switch (a.type) {
                            case 10:
                                prev[semesterID][module]["lectures"] = prev[semesterID][module]["lectures"].map(b => b.id === a.id ? a : b)
                                console.log("Step 3b", prev[semesterID][module]["lectures"])
                                break
                            case 20:
                                prev[semesterID][module]["tutorials"] = prev[semesterID][module]["tutorials"].map(b => b.id === a.id ? a : b)
                                break
                            case 30:
                                prev[semesterID][module]["exams"] = prev[semesterID][module]["exams"].map(b => b.id === a.id ? a : b)
                                break
                            default:
                                prev[semesterID][module]["others"] = prev[semesterID][module]["others"].map(b => b.id === a.id ? a : b)
                        }
                    }
                }
                // console.log("semestersMap[" + semesterID + "][" + module + "]", prev[semesterID][module])
                console.log("Step 2cc")
                processFilter(prev, modified[0].start, modified[0])
                return prev
            })
            break;
        case "deleteMany": // Todo: Only delete one
            // setAppointments((prev) => { // Todo remove
            storeUndoData(type,
                // prev.filter(a => modified.find(b => b.id === a.id) ? true : false)
                []
                , secondUndo)
            //   return prev.filter(a => modified.find(b => b.id === a.id) ? false : true)
            // })
            setSemestersMap(prev => {
                let tmp = checkIfSemesterAndModuleExist(prev, semesterID, module)
                if (modified.length > 0) {
                    if (isUndefined(tmp[semesterID][module])) {
                        console.error("is undefined", module)
                    } else {
                        for (const a of modified) {

                            let appointmentType = (lowerCase(mapType(a.type > 30 ? 100 : a.type)) + "s")
                            console.log("what is there", semesterID, module, appointmentType, tmp[semesterID][module][appointmentType], tmp) // Todo: Not always everything deleted. Also visibleAppointments not correctly updated.
                            const { [semesterID]: { [module]: { [appointmentType]: toBeFreed, ...restModule }, ...restSemester }, ...restSemestersMap } = tmp
                            tmp = { ...restSemestersMap, [semesterID]: { ...restSemester, [module]: { ...restModule, [appointmentType]: toBeFreed.filter(b => b.id !== a.id) } } }
                            console.log("toBeFreed", toBeFreed)
                        }
                    }

                    console.log("semestersMap[" + semesterID + "][" + module + "]", tmp[semesterID][module])
                    processFilter(tmp, modified[0].start, modified[0], "delete")
                }
                return tmp
            })
            break;
        case "deleteAll":
            // setAppointments((prev) => { // Todo
            storeUndoData(type,
                // prev.filter(a => a.module !== "Periods")
                []
                , secondUndo)
            //   const newLocal_1 = prev.filter(a => a.module === "Periods")
            //   processFilter2ReplaceAll(newLocal_1)
            //   return newLocal_1
            // })
            setSemestersMap(prev => {
                for (const key of Object.keys(prev)) {
                    for (const m of Object.keys(prev[key])) {
                        if (m !== "Periods") {
                            prev[key][m]["lectures"] = []
                            prev[key][m]["tutorials"] = []
                            prev[key][m]["exams"] = []
                            prev[key][m]["others"] = []
                        }
                    }
                }
                console.log("deleteAll: semestersMap", prev)
                return prev
            })
            localStorage.removeItem("semestersMap"); // <-- Clear from localStorage too
            setVisibleAppointments(prev => prev.filter(a => a.module === "Periods")) ///TODO : error
            setSelected(null)
            setAnalyzeAllConflicts(false)
            break;
        case "addMultipleModules": {
            // 'modified' is an array of modules (built from XLSX).
            const modulesToAdd = modified;

            setSemestersMap(prevMap => {
                let tmp = { ...prevMap };
                let newMaxID = tmp.maxID || 0;

                // For each module in the array...
                for (const mod of modulesToAdd) {
                    // 1) Possibly rename the module if it already exists in the same semester
                    let counter = 2;
                    let newModuleName = mod.title;
                    while (tmp[mod.semesterID] && tmp[mod.semesterID][newModuleName]) {
                        newModuleName = mod.title + " " + counter;
                        counter++;
                    }
                    mod.title = newModuleName; // rename it for storage

                    // 2) Ensure the semester & module exist
                    tmp = checkIfSemesterAndModuleExist(tmp, mod.semesterID, newModuleName);

                    // 3) Add IDs
                    const result = addMaxIDsAndModuleName(
                        newMaxID,
                        newModuleName,
                        mod.lectures,
                        mod.tutorials,
                        mod.exams,
                        mod.others
                    );
                    newMaxID = result.newMaxID;
                    let lectures = result.lectures;
                    let tutorials = result.tutorials;
                    let exams = result.exams;
                    let others = result.others;

                    // 4) Move to condensed week if desired
                    lectures = moveAppointmentsToCondensedWeek(lectures, mod.semesterID, true);
                    tutorials = moveAppointmentsToCondensedWeek(tutorials, mod.semesterID, true);

                    // 5) Put them into the final place
                    tmp[mod.semesterID][newModuleName] = buildModule(
                        mod.semesterID,
                        mod.LV,
                        newModuleName,
                        mod.level,
                        mod.fixed,
                        mod.optional,
                        mod.rhythm,
                        mod.faculty,
                        mod.responsibleInstructor,
                        mod.numberOfParticipants,
                        lectures,
                        tutorials,
                        exams,
                        others
                    );
                }
                console.log("Updated semestersMap:", tmp); // <--- Place debug log here

                // Return updated
                return { ...tmp, maxID: newMaxID };
            });

            // If you maintain “conflict maps” or “modulesInSameSemesterMap,” do them in one pass here:
            setModulesInSameSemesterMap(prev => {
                const newMap = { ...prev };
                for (const mod of modulesToAdd) {
                    const key = mod.semesterID % 10;
                    if (!newMap[key]) newMap[key] = {};
                    newMap[key][mod.title] = new Set();
                }
                return newMap;
            });

            // Similarly for setPreviousYearConflictMap, setNextYearConflictMap, etc.
            break;
        }

        case "addModule":
            storeUndoData(type, modified, secondUndo, undoStack, setUndoStack, warnSwitch, undoNumber)
            setSemestersMap(prev => {
                // Check if new module is to be in a different semester
                let difference = 0
                let month
                let year;
                if (modified.semesterID !== semesterID) {
                    const oldSemesterID = modified.semesterID
                    console.log("different sems")

                    if (semesterID % 10 === 0) {
                        month = 3;
                        year = semesterID / 10;
                    } else {
                        month = 9;
                        year = (semesterID - 1) / 10;
                    }

                    const weekDay = new Date(year, 3, 15).getDay(); // If Wednesday, difference is zero.
                    difference = (weekDay === 0 ? -1 : weekDay === 6 ? -2 : weekDay - 1) - 2;
                    difference = semesterID % 10 === 0 ? difference + 1 : difference + 2
                    difference = oldSemesterID % 10 === 0 ? difference + 1 : difference
                }

                // Increment module name, if it already existant
                let counter = 2
                let newModuleName = modified.title
                while (prev[semesterID] && prev[semesterID][newModuleName]) {
                    newModuleName = modified.title + " " + counter
                    counter = counter + 1
                }
                modified["title"] = newModuleName  // Critical fix

                let tmp = checkIfSemesterAndModuleExist(prev, semesterID, newModuleName)
                // Add maxIds
                let newMaxID = tmp.maxID
                // console.log("newMaxID", newMaxID)
                let lectures
                let tutorials
                let exams
                let others
                ({ newMaxID, lectures, tutorials, exams, others } = addMaxIDsAndModuleName(
                    newMaxID, newModuleName, modified.lectures, modified.tutorials, modified.exams, modified.others
                ));

                // Add module
                modified["title"] = newModuleName

                modified["lectures"] = moveAppointmentsToCondensedWeek(lectures, semesterID, true)
                modified["tutorials"] = moveAppointmentsToCondensedWeek(tutorials, semesterID, true)
                modified["exams"] = exams
                modified["others"] = others

                // Todo: Move date, if desired.
                // modified["lectures"] = moveAppointmentsToCondensedWeek(moveAppointmentDates(lectures, year, month, difference), semesterID, true)
                // modified["tutorials"] = moveAppointmentsToCondensedWeek(moveAppointmentDates(tutorials, year, month, difference), semesterID, true)
                // modified["exams"] = moveAppointmentDates(exams, year, month, difference)
                // modified["others"] = moveAppointmentDates(others, year, month, difference)

                // modified["lectures"] = moveAppointmentDates(lectures, year, month, difference)
                // modified["tutorials"] = moveAppointmentDates(tutorials, year, month, difference)
                // modified["exams"] = moveAppointmentDates(exams, year, month, difference)
                // modified["others"] = moveAppointmentDates(others, year, month, difference)
                // Todo: also move to condensed week?
                tmp[semesterID][newModuleName] = modified
                // Todo: functions are not pure. And the sets need to be updated.
                setModulesInSameSemesterMap(prev => {
                    const key = semesterID % 10;
                    const updated = { ...prev };
                    if (!updated[key]) updated[key] = {};
                    updated[key][newModuleName] = new Set();
                    return updated;
                });
                setPreviousYearConflictMap(prev => {
                    const updated = new Map(prev);
                    updated.set(newModuleName, new Set());
                    return updated;
                });

                setNextYearConflictMap(prev => {
                    const updated = new Map(prev);
                    updated.set(newModuleName, new Set());
                    return updated;
                });
                // console.log("newMaxID", newMaxID)
                return { ...tmp, maxID: newMaxID }
            })

            setSelected(null)
            setAnalyzeAllConflicts(false)
            break;

            const modulesArray = modified;

            // We'll store everything in one “big” update
            setSemestersMap((prev) => {
                let tmp = { ...prev };
                let newMaxID = tmp.maxID || 0;

                for (const mod of modulesArray) {
                    // 1) Possibly rename module if it already exists
                    let counter = 2;
                    let newModuleName = mod.title;
                    while (tmp[mod.semesterID] && tmp[mod.semesterID][newModuleName]) {
                        newModuleName = mod.title + " " + counter;
                        counter++;
                    }
                    mod.title = newModuleName; // rename it

                    // 2) Ensure semester & module exist
                    tmp = checkIfSemesterAndModuleExist(tmp, mod.semesterID, newModuleName);

                    // 3) Add new IDs
                    let { newMaxID: nm, lectures, tutorials, exams, others } =
                        addMaxIDsAndModuleName(
                            newMaxID,
                            newModuleName,
                            mod.lectures,
                            mod.tutorials,
                            mod.exams,
                            mod.others
                        );
                    newMaxID = nm;

                    // 4) Move to condensed week, etc.
                    lectures = moveAppointmentsToCondensedWeek(lectures, mod.semesterID, true);
                    tutorials = moveAppointmentsToCondensedWeek(tutorials, mod.semesterID, true);

                    // 5) Put them into the final place
                    tmp[mod.semesterID][newModuleName] = {
                        ...buildModule(
                            mod.semesterID,
                            mod.LV,
                            newModuleName,
                            mod.level,
                            mod.fixed,
                            mod.optional,
                            mod.rhythm,
                            mod.faculty,
                            mod.responsibleInstructor,
                            mod.numberOfParticipants,
                            lectures,
                            tutorials,
                            exams,
                            others
                        )
                    };
                }

                // 6) Return updated
                return { ...tmp, maxID: newMaxID };
            });

            // If your code sets sets for conflict maps or modulesInSameSemesterMap:
            setModulesInSameSemesterMap((prev) => {
                // batch update all modules in ONE go
                const updated = { ...prev };
                for (const mod of modified) {
                    const key = mod.semesterID % 10;
                    if (!updated[key]) updated[key] = {};
                    updated[key][mod.title] = new Set();
                }
                return updated;
            });

            // likewise for setPreviousYearConflictMap(...) and setNextYearConflictMap(...)
            // do in single pass

            // If you also do a single pass with processFilter, do it after the loop if needed
            // e.g. processFilter(...) once or on the last module
            // or skip if not needed for every single module in real-time

            break;
        case "mergeModules": // Todo
            storeUndoData(type, modified, secondUndo, undoStack, setUndoStack, warnSwitch, undoNumber)
            setSemestersMap(prev => {
                const tmp = checkIfSemesterAndModuleExist(prev, semesterID, modified)
                // console.log("semestersMap[" + semesterID + "][" + modified + "]", tmp[semesterID][modified])
                return tmp
            })
            setSelected(null)
            setAnalyzeAllConflicts(false)
            break;
        case "deleteModule":
            storeUndoData(type, modified, secondUndo, undoStack, setUndoStack, warnSwitch, undoNumber)
            // setModules((prev) => prev.filter(m => m !== modified))
            setSemestersMap(prev => {
                let tmp = checkIfSemesterAndModuleExist(prev, semesterID, modified)
                // This is so complicated to create a new tmp. Modification in place: // delete tmp[semesterID][modified]
                const { [semesterID]: { [modified]: removed, ...restSemester }, ...restSemestersMap } = tmp
                tmp = { ...restSemestersMap, [semesterID]: { ...restSemester } }
                console.log("semestersMap[" + semesterID + "][" + modified + "]", tmp[semesterID][modified], removed)
                processFilter(tmp, visibleDate, null, "deleteModule")
                return tmp
            })
            // Todo: This is not updated correctly
            setCurrentModule("No Module")
            setSelected(null)
            setAnalyzeAllConflicts(false)
            break;
        case "addLecturer":
            storeUndoData(type, modified, secondUndo, undoStack, setUndoStack, warnSwitch, undoNumber)
            setLecturers((prev) => {
                let ls = [...prev, modified]
                ls.sort()
                return ls
            })
            break;
        case "deleteLecturer":
            storeUndoData(type, modified, secondUndo, undoStack, setUndoStack, warnSwitch, undoNumber)
            setLecturers((prev) => prev.filter(p => p !== modified))
            break;
        case "addRoom":
            storeUndoData(type, modified, secondUndo, undoStack, setUndoStack, warnSwitch, undoNumber)
            setRooms((prev) => {
                let rs = [...prev, modified]
                rs.sort()
                return rs
            })
            break;
        case "deleteRoom":
            storeUndoData(type, modified, secondUndo, undoStack, setUndoStack, warnSwitch, undoNumber)
            setRooms((prev) => prev.filter(r => r !== modified))
            break;
        case "addStudyplan":
            storeUndoData(type, modified, secondUndo, undoStack, setUndoStack, warnSwitch, undoNumber)
            setStudyplans((prev) => {
                Object.entries(modified).forEach(([key, value]) => {
                    console.log("addStudyplan2", modified, key, value)
                    prev = { ...prev, [key]: value }
                })
                return prev
            })
            setSelected(null)
            setAnalyzeAllConflicts(false)
            break;
        case "deleteStudyplan":
            let tmp = {}
            // tmp[modified] = studyplans[modified]
            storeUndoData(type, tmp, secondUndo, undoStack, setUndoStack, warnSwitch, undoNumber)
            setStudyplans((prev) => {
                // delete prev[modified]; // Easier, but does not create new object.
                const { [modified]: removed, ...otherStudyplans } = prev
                // processFilter() // Todo
                return otherStudyplans
            })
            break;
        case "addModulesToStudyplan":
            console.log("addModulesToStudyplan", modified, modified.key, modified.value)
            storeUndoData(type, modified, secondUndo, undoStack, setUndoStack, warnSwitch, undoNumber)
            setStudyplans((prev) => {
                // Todo
                // Object.entries(modified).forEach(([key, value]) => {
                //   console.log("addModulesToStudyplan", modified, key, value)
                //   prev[key]["modules"] = [...prev[key]["modules"], ...value.modules]
                // })
                // processFilter() // Todo
                return prev
            })
            break;
        case "deleteModulesFromStudyplan":
            storeUndoData(type, modified, secondUndo, undoStack, setUndoStack, warnSwitch, undoNumber)
            setStudyplans((prev) => {
                // Todo
                // Object.entries(modified).forEach(([key, value]) => {
                //   console.log("addModulesToStudyplan", modified, key, value)
                //   prev[key]["modules"] = [...prev[key]["modules"].filter(m => {
                //     if (value.modules.find(n => n.id === m.id)) {
                //       return false
                //     } else {
                //       return true
                //     }
                //   })]
                // })
                // processFilter() // Todo
                return prev
            })
            break;
        case "addSemester":
            storeUndoData()
            setSemestersMap(prev => {
                const tmp = checkIfSemesterAndModuleExist(prev, modified, "No Module")
                // console.log("addSemester semestersMap[" + modified + "][" + "Periods" + "]", tmp[modified]["Periods"], tmp)
                processFilter(tmp,
                    tmp[modified]["Periods"]["others"].find(p => p.id === -1).start,
                    tmp[modified]["Periods"]["others"].find(p => p.id === -1),
                    "addSemester")
                return tmp
            })
            setSelected(null)
            setAnalyzeAllConflicts(false)
            break;
        case "copySemester":
            storeUndoData()
            setSemestersMap(prev => {
                let tmp = prev
                let newMaxID = prev.maxID
                const oldSemesterID = getSemesterIDfromString(semesterID)
                console.log("copy", oldSemesterID, "to", modified, prev[oldSemesterID], prev)
                if (oldSemesterID !== modified) {
                    let month;
                    let year;

                    if (modified % 10 === 0) {
                        month = 3;
                        year = modified / 10;
                    } else {
                        month = 9;
                        year = (modified - 1) / 10;
                    }

                    const weekDay = new Date(year, 3, 15).getDay();
                    let difference = (weekDay === 0 ? -1 : weekDay === 6 ? -2 : weekDay - 1) - 2;
                    difference = modified % 10 === 0 ? difference + 1 : difference + 2
                    difference = oldSemesterID % 10 === 0 ? difference + 1 : difference

                    tmp = checkIfSemesterAndModuleExist(prev, modified, "No Module")
                    for (const [key, module] of Object.entries(tmp[oldSemesterID])) {
                        if (key !== "Periods") {
                            let lectures
                            let tutorials
                            let exams
                            let others
                            ({ newMaxID, lectures, tutorials, exams, others } = addMaxIDsAndModuleName(newMaxID, module.title, module.lectures, module.tutorials, module.exams, module.others));
                            tmp = importItems(tmp, modified, key,
                                moveAppointmentDates(lectures, year, month, difference), // Move to condensed week?
                                moveAppointmentDates(tutorials, year, month, difference),
                                moveAppointmentDates(exams, year, month, difference),
                                moveAppointmentDates(others, year, month, difference),
                                true
                            )
                        }
                    }

                    // console.log("copySemester semestersMap[" + modified + "][" + "Periods" + "]", tmp[modified]["Periods"], tmp, oldSemesterID)
                    processFilter(tmp,
                        tmp[modified]["Periods"]["others"].find(p => p.id === -1).start,
                        tmp[modified]["Periods"]["others"].find(p => p.id === -1),
                        "addSemester")
                }
                return { ...tmp, maxID: newMaxID }
            })

            setSelected(null)
            setAnalyzeAllConflicts(false)
            break;
        case "moveSemester":
            storeUndoData()
            setSemestersMap(prev => {
                let tmp = prev
                const oldSemesterID = getSemesterIDfromString(semesterID)
                console.log("copy", oldSemesterID, "to", modified, prev[oldSemesterID], prev)
                let month;
                let year;

                if (modified % 10 === 0) {
                    month = 3;
                    year = modified / 10;
                } else {
                    month = 9;
                    year = (modified - 1) / 10;
                }

                let difference = 0
                if (oldSemesterID === modified) {
                    // console.warn("Todo: Moving Semester is still buggy", oldSemesterID, modified, module)
                    difference = difference - module
                } else {
                    const weekDay = new Date(year, 3, 15).getDay(); // When it is Wednesday (3), the difference should be 0
                    difference = (weekDay === 0 ? -1 : weekDay === 6 ? -2 : weekDay - 1) - 2;
                    difference = modified % 10 === 0 ? difference + 1 : difference + 2
                    difference = oldSemesterID % 10 === 0 ? difference + 1 : difference
                }
                tmp = checkIfSemesterAndModuleExist(prev, modified, "No Module")
                for (const [key, module] of Object.entries(prev[oldSemesterID])) {
                    if (key !== "Periods") {
                        tmp = importItems(tmp, modified, key,
                            moveAppointmentDates(module.lectures, year, month, difference),
                            moveAppointmentDates(module.tutorials, year, month, difference),
                            moveAppointmentDates(module.exams, year, month, difference),
                            moveAppointmentDates(module.others, year, month, difference),
                            true
                        )
                        // if (oldSemesterID === modified) {
                        //     delete tmp[oldSemesterID][key]
                        // }
                    }
                }
                if (oldSemesterID !== modified) {
                }
                delete tmp[oldSemesterID]

                // console.log("moveSemester semestersMap[" + modified + "][" + "Periods" + "]", tmp[modified]["Periods"], tmp, oldSemesterID)
                processFilter(tmp,
                    tmp[modified]["Periods"]["others"].find(p => p.id === -1).start,
                    tmp[modified]["Periods"]["others"].find(p => p.id === -1),
                    "addSemester")

                return tmp
            })
            setSelected(null)
            setAnalyzeAllConflicts(false)
            break;
        case "deleteSemester":
            storeUndoData(type, modified, secondUndo, undoStack, setUndoStack, warnSwitch, undoNumber)
            setSemestersMap(prev => {
                const oldSemesterID = getSemesterIDfromString(modified)
                let tmp = { ...prev }
                delete tmp[oldSemesterID]
                console.log("deleted semestersMap[" + oldSemesterID + "]", tmp[oldSemesterID], modified)
                processFilter(tmp, visibleDate, null, "deleteSemester")
                return { ...tmp }
            })
            setCurrentModule("No Module")
            setSelected(null)
            setAnalyzeAllConflicts(false)
            break;
        default:
            console.error("Update type does not exist:", type)
    }
}



export function checkIfSemesterAndModuleExist(semestersMap, semesterID, module) {
    // Clone the existing semestersMap
    let tmp = { ...semestersMap };

    // If semester doesn't exist, initialize it
    if (isUndefined(tmp[semesterID])) {
        tmp[semesterID] = {};
    }

    // If 'Periods' doesn't exist, add it
    if (isUndefined(tmp[semesterID]["Periods"])) {
        tmp[semesterID]["Periods"] = getPeriodsModule(semesterID);
    }

    // If module doesn't exist, build it
    if (module !== "Periods" && isUndefined(tmp[semesterID][module])) {
        tmp[semesterID][module] = buildModule(
            semesterID, "LV-unknown", module, "unknown",
            false, true, 2, "FB12", "unknown", 0,
            [], [], [], []
        );
    }

    // If module is present but lacks required fields, ensure they're initialized
    if (module !== "Periods") {
        const fields = ["lectures", "tutorials", "exams", "others"];
        for (const field of fields) {
            if (isUndefined(tmp[semesterID][module][field])) {
                tmp[semesterID][module][field] = [];
            }
        }
    }

    // Ensure maxID exists
    if (isUndefined(tmp.maxID)) {
        tmp.maxID = semestersMap.maxID || 0;
    }
    console.log("Module structure:", tmp[semesterID][module])

    return tmp;
}



const getPeriodAppointments = (semesterID) => {
    const { year, month, difference } = getWeekDayYearDifference(semesterID)
    return [
        {
            id: -1,
            module: "Periods",
            title: "Condensed Week",
            type: 444,
            start: new Date(year, month, 7 - difference),
            end: new Date(year, month, 14 - difference),
            semesterID,
            allDay: true,
            isDraggable: false,
        },
        {
            id: -2,
            module: "Periods",
            title: "Lecture Period",
            type: 444,
            start: new Date(year, month, 15 - difference),
            end: new Date(year, month + 3 + (semesterID % 10), 19 - difference),
            semesterID,
            allDay: true,
            isDraggable: false,
        },
        {
            id: -3,
            module: "Periods",
            title: "Exam Period 1",
            type: 444,
            start: new Date(year, month + 3 + (semesterID % 10), 15 - difference),
            end: new Date(year, month + 4 + (semesterID % 10), 3 - difference),
            semesterID,
            allDay: true,
            isDraggable: false,
        },
        {
            id: -4,
            module: "Periods",
            title: "Exam Period 2",
            type: 444,
            start: new Date(year, month + 5, 16 - difference),
            end: new Date(year, month + 5, 28 - difference),
            semesterID,
            allDay: true,
            isDraggable: false,
        },
        noPeriodDefault
    ]
}




function getPeriodsModule(semesterID) {
    return buildModule(semesterID, "LV-periods", "Periods", "", true, false, 1, "FB12", "", 0,
        [], [], [], getPeriodAppointments(semesterID))
}


export function storeUndoData(type, data, secondUndo, undoStack, setUndoStack, warnSwitch, undoNumber) {
    // console.warn("Todo: storeUndoData")
    // if (warnSwitch && undoStack.length > (undoNumber - 10)) {
    //     showAlertMessage('warning', "Undo stack is full soon!")
    // }
    // setUndoStack((prev) => {
    //     prev.push({ type: type, secondUndo: secondUndo, data: data })
    //     if (prev.length > undoNumber) {
    //         console.log("Undo stack is full", undoStack)
    //         prev.shift()
    //     }
    //     return prev
    // })
    // setUndoStack([]) // Todo remove
}

export function undo() {
    return () => {
        // let secondUndo = false;
        // if (undoStack.length > 0) {
        //   setUndoStack((undo) => {
        //     const old = undo.pop()
        //     console.log("undoStack", undo, old)
        //     secondUndo = old.secondUndo
        //     switch (old.type) {
        //       case "add":
        //         setRedoStack((redo) => {
        //           redo.push(old)
        //           return redo
        //         })
        //         setAppointments((prev) => {
        //           const newLocal1 = prev.filter(a => (old.data.find(b => b.id === a.id)) ? false : true)
        //           processFilter2Delete(newLocal1, period)
        //           return newLocal1
        //         })
        //         break;
        //       case "replace":
        //         setAppointments((prev) => {
        //           setRedoStack((redo) => {
        //             redo.push({
        //               ...old, data: prev.filter(a => !isUndefined(old.data.find(b => b.id === a.id)))
        //             })
        //             return redo
        //           })
        //           const newLocal2 = prev.map(a => {
        //             const modified = old.data.find(b => b.id === a.id)
        //             if (modified) {
        //               return modified
        //             } else {
        //               return a
        //             }
        //           })
        //           processFilter2ReplaceAll(newLocal2)
        //           return newLocal2
        //         })
        //         break;
        //       case "delete":
        //         setRedoStack((redo) => {
        //           redo.push(old)
        //           return redo
        //         })
        //         setAppointments((prev) => [...prev, ...old.data])
        //         processFilter2WithNew(old.data, period)
        //         break;
        //       case "deleteAll":
        //         setRedoStack((redo) => {
        //           redo.push({ ...old, data: [] })
        //           return redo
        //         })
        //         setAppointments((prev) => [...prev, ...old.data])
        //         processFilter2WithNew(old.data, period)
        //         break;
        //       case "addModule":
        //         setRedoStack((redo) => {
        //           redo.push(old)
        //           return redo
        //         })
        //         setModules((prev) => prev.filter(m => isUndefined(old.data.find(n => n === m)) ? true : false))
        //         setCurrentModule("No Module")
        //         break;
        //       case "deleteModule":
        //         setRedoStack((redo) => {
        //           redo.push(old)
        //           return redo
        //         })
        //         setModules((prev) => [...prev, old.data])
        //         break;
        //       case "addLecturer":
        //         setRedoStack((redo) => {
        //           redo.push(old)
        //           return redo
        //         })
        //         setLecturers((prev) => prev.filter(l => isUndefined(old.data.find(n => n === l)) ? true : false))
        //         break;
        //       case "deleteLecturer":
        //         setRedoStack((redo) => {
        //           redo.push(old)
        //           return redo
        //         })
        //         setLecturers((prev) => [...prev, old.data])
        //         break;
        //       case "addRoom":
        //         setRedoStack((redo) => {
        //           redo.push(old)
        //           return redo
        //         })
        //         setRooms((prev) => prev.filter(r => isUndefined(old.data.find(n => n === r)) ? true : false))
        //         break;
        //       case "deleteRoom":
        //         setRedoStack((redo) => {
        //           redo.push(old)
        //           return redo
        //         })
        //         setRooms((prev) => [...prev, old.data])
        //         break;
        //       case "addStudyplan":
        //         setRedoStack((redo) => {
        //           redo.push(old)
        //           return redo
        //         })
        //         setStudyplans((prev) => {
        //           Object.entries(old.data).forEach(([key, value]) => {
        //             console.log("Undo addModulesToStudyplan", old.data, key, value)
        //             delete prev[key];
        //           })
        //           return prev
        //         })
        //         break;
        //       case "deleteStudyplan":
        //         setRedoStack((redo) => {
        //           redo.push({ ...old, data: Object.keys(redo.data)[0] })
        //           return redo
        //         })
        //         setStudyplans((prev) => {
        //           Object.entries(old.data).forEach(([key, value]) => {
        //             console.log("Undo addModulesToStudyplan", old.data, key, value)
        //             prev[key] = value
        //           })
        //           return prev
        //         })
        //         break;
        //       case "addModulesToStudyplan":
        //         setRedoStack((redo) => {
        //           redo.push(old)
        //           return redo
        //         })
        //         setStudyplans((prev) => {
        //           Object.entries(old.data).forEach(([key, value]) => {
        //             console.log("Undo addModulesToStudyplan", old.data, key, value)
        //             prev[key]["modules"] = [...prev[key]["modules"].filter(m => {
        //               if (value.modules.find(n => n.id === m.id)) {
        //                 return false
        //               } else {
        //                 return true
        //               }
        //             })]
        //           })
        //           return prev
        //         })
        //         break;
        //       case "deleteModulesFromStudyplan":
        //         setRedoStack((redo) => {
        //           redo.push(old) // Todo
        //           return redo
        //         })
        //         setStudyplans((prev) => {
        //           Object.entries(old.data).forEach(([key, value]) => {
        //             console.log("addModulesToStudyplan", old.data, key, value)
        //             prev[key]["modules"] = [...prev[key]["modules"], ...value.modules]
        //           })
        //           return prev
        //         })
        //         break;
        //       default:
        //         console.error("Undo update type does not exist:", old.type)
        //     }
        //     return undo
        //   })
        // } else {
        //   // Color of UndoIcon is changed      
        // }
        // if (secondUndo) {
        //   console.log("secondUndo")
        //   const tmpFunction = undo()
        //   tmpFunction()
        // }
    }
}

export function redo() {
    return () => {
        if (redoStack.length > 0) {
            setRedoStack((prev) => {
                let redo = prev.pop()
                console.log("redoStack", prev, redo)
                change(redo.type, redo.data, redo.secondUndo, false, redo.semesterID, redo.module, setSemestersMap, undoStack, setUndoStack, setRedoStack, warnSwitch, undoNumber)
                while (prev.length > 0 && prev[prev.length - 1].secondUndo) {
                    redo = prev.pop()
                    change(redo.type, redo.data, redo.secondUndo, false, redo.semesterID, redo.module, setSemestersMap, undoStack, setUndoStack, setRedoStack, warnSwitch, undoNumber)
                }
                return prev
            })
        } else {
            // Color of RedoIcon is changed
        }
    }
}

export function logChanges(type, modified, secondUndo, semesterID, module,
    visibleDate, selected, analyzeAllConflicts, analyzeConflictsForOne,
    freeSlotConflictSeverity, filterPeriods, filterStudyplans, filterModules, filterTypes, filterRhythms,
    filterLecturers, filterRooms, filterParticipants, filterAppointments, filterDraggable
) {
    console.log("Auto-saving changes to localStorage");
    
    // 1. Create a snapshot of the current state
    const snapshot = {
        timestamp: new Date().toISOString(),
        lastAction: {
            type,
            semesterID,
            module
        },
        state: {
            semesterID, 
            module,
            visibleDate: visibleDate ? visibleDate.toISOString() : null,
            selected: selected ? {
                id: selected.id,
                module: selected.module,
                title: selected.title
            } : null,
            filters: {
                freeSlotConflictSeverity,
                filterPeriods,
                filterStudyplans,
                filterModules,
                filterTypes, 
                filterRhythms,
                filterLecturers,
                filterRooms,
                filterParticipants,
                filterAppointments,
                filterDraggable
            },
            analyzeAllConflicts,
            analyzeConflictsForOne
        }
    };

    // 2. Save the snapshot to localStorage
    localStorage.setItem('isp_autosave_snapshot', JSON.stringify(snapshot));
    
    // 3. Save the timestamp of the last change for change detection
    localStorage.setItem('isp_last_change_timestamp', new Date().toISOString());

    // 4. Update the unsaved changes flag
    localStorage.setItem('isp_has_unsaved_changes', 'true');
}


