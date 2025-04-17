import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../../../../src/addons/dragAndDrop/styles.scss'

import { getModules } from '../../dataDisplay/getData';
import { marginTop } from '../../settings/settings'
import { SemesterPicker } from '../../userInteraction/components';
import { getSemesterIDFromYearAndSemester } from '../../tools/functions';
import { buildModule } from '../dataImport';




export function RenameDialog(openGroupingRename,
    grouping, openAlertDialog, semestersMap, lecturers, rooms,
    setCurrentModule, handleChange, setOpenGroupingRename, newName, oldName,
    year, setYear, semester, setSemester
) {

    const [name, setName] = useState("New Object");

    const handleNameChange = (newValue) => { setName(newValue.target.value); }; // Todo: Why is it so slow?

    const currentSemesterID = getSemesterIDFromYearAndSemester(year, semester)

    useEffect(() => {
        setName(newName)
    }, [newName])


    function checkRename() {
        return (event) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const formJson = Object.fromEntries(formData.entries())
            const newObjectName = formJson.renamemodule
            console.log("renaming object", oldName, "to", newObjectName)

            switch (grouping) {
                case "Semesters":
                    // Not called, as using a different dialog.
                    break
                case "Studyplans":
                    // Not called, as using a different dialog.
                    break
                case "Modules":
                    if (semestersMap[currentSemesterID] && getModules(semestersMap[currentSemesterID]).find(m => m === newObjectName)) {
                        openAlertDialog(("A module with the name '" + newObjectName + "' already exists!\n Do you want to merge the two modules?"),
                            "Cancel",
                            "Merge",
                            () => { renameModule(newObjectName) })
                    } else {
                        renameModule(newObjectName)
                    }
                    break
                case "Lecturers":
                    if (lecturers.find(l => l === newObjectName)) {
                        openAlertDialog(("The lecturer '" + newObjectName + "' is already stored!\n Appointments will be merged!"),
                            "Cancel",
                            "Merge",
                            () => { renameLecturer(newObjectName) })
                    } else {
                        renameLecturer(newObjectName)
                    }
                    break
                case "Rooms":
                    if (rooms.find(r => r === newObjectName)) {
                        openAlertDialog(("The room '" + newObjectName + "' is already stored!\n Appointments will be merged!"),
                            "Cancel",
                            "Merge",
                            () => { renameRoom(newObjectName) })
                    } else {
                        renameRoom(newObjectName)
                    }
                    break
                case "Periods":
                    // Not called, as using a different dialog.
                    break
                case "Types":
                    // Todo
                    break
                default:
                    console.error("Grouping not available #8", grouping)
            }

        }
    }

    function renameModule(newModuleName) {
        console.log("renameModule()", newModuleName)
        if (oldName === "##xy8e%3-neverToBeFound-j$3j@je9K") {
            setCurrentModule(newModuleName)
            handleChange("addModule", buildModule(
                currentSemesterID, "LV-unknown", newModuleName, "unknown",
                false, true, 2, "FB12", "unknown", 0,
                [], [], [], []
            ), false, currentSemesterID, newModuleName)
        } else {
            // Todo
            // handleChange("replaceMany", appointments.filter(a => a.module === oldName).map(a => { return { ...a, module: newModuleName } }), false, true, currentSemesterID, newModuleName)
            handleChange("deleteModule", oldName, false, currentSemesterID, oldName)
            handleChange("addModule", buildModule(
                currentSemesterID, "LV-unknown", newModuleName, "unknown",
                false, true, 2, "FB12", "unknown", 0,
                [], [], [], []
            ), true, currentSemesterID, newModuleName)
        }
        setOpenGroupingRename(false)
    }

    function renameLecturer(newLecturerName) {
        console.log("renameLecturer()", newLecturerName)
        if (oldName === "##xy8e%3-neverToBeFound-j$3j@je9K") {
            handleChange("addLecturer", newLecturerName, false, 0, "Lecturers")
        } else {
            // Todo
            // handleChange("replaceMany", appointments.filter(a => a.lecturer === oldName).map(a => { return { ...a, lecturer: newLecturerName } }), false, true, currentSemesterID, currentModule)
            handleChange("deleteLecturer", oldName, false, 0, "Lecturers")
            handleChange("addLecturer", newLecturerName, true, 0, "Lecturers")
        }
        setOpenGroupingRename(false)
    }

    function renameRoom(newRoomName) {
        console.log("renameRoom()", newRoomName)
        if (oldName === "##xy8e%3-neverToBeFound-j$3j@je9K") {
            handleChange("addRoom", newRoomName, false, 0, "Rooms")
        } else {
            // Todo
            // handleChange("replaceMany", appointments.filter(a => a.room === oldName).map(a => { return { ...a, room: newRoomName } }), false, true, currentSemesterID, currentModule)
            handleChange("deleteRoom", oldName, false, 0, "Rooms")
            handleChange("addRoom", newRoomName, true, 0, "Rooms")
        }
        setOpenGroupingRename(false)
    }

    return (
        <div>
            <Dialog
                open={openGroupingRename}
                onClose={() => setOpenGroupingRename(false)}
                PaperProps={{
                    component: 'form',
                    style: { width: '1250px' },
                    onSubmit: checkRename(),
                }}
            >
                <DialogTitle>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div>
                            {oldName === "##xy8e%3-neverToBeFound-j$3j@je9K"
                                ? "Enter new " + grouping.substring(0, grouping.length - 1).toLowerCase() + " name."
                                : "Renaming " + grouping.substring(0, grouping.length - 1).toLowerCase() + " '" + oldName + "'?\n Please enter a new name."
                            }
                        </div>
                        <div style={{ marginLeft: 'auto' }}>
                            {(grouping === "Modules" || grouping === "Types") && SemesterPicker(year, setYear, semester, setSemester)}
                        </div>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth id="rename-module"
                        label="New name"
                        name="renamemodule"
                        value={name}
                        onChange={handleNameChange}
                        sx={{ mt: marginTop }}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenGroupingRename(false)}>Cancel</Button>
                    <Button type="submit">{oldName === "##xy8e%3-neverToBeFound-j$3j@je9K" ? "Create" : "Rename"}</Button>
                </DialogActions>
            </Dialog>
        </div>

    );

}
