import React, { useState } from 'react'
import moment from 'moment'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../../../../src/addons/dragAndDrop/styles.scss'

import { marginTop } from '../../settings/settings'
import { SemesterPicker } from '../../userInteraction/components';
import { getSemesterIDFromYearAndSemester } from '../../tools/functions';



export function SemestersDialog(
    openSemestersDialog, setOpenSemestersDialog, handleChange, setVisibleDate, changeType, oldSemester
) {
    const [year, setYear] = useState(moment())
    const [semester, setSemester] = useState('WiSe')
    const [difference, setDifference] = useState(0)

    return (
        <div>
            <Dialog
                open={openSemestersDialog}
                onClose={() => setOpenSemestersDialog(false)}
                PaperProps={{
                    component: 'form',
                    style: { width: '520px' },
                    onSubmit: (event) => {
                        event.preventDefault();
                        setVisibleDate(year.toDate())
                        switch (changeType) {
                            case "copyModule":
                                handleChange("addModule",
                                    oldSemester, false,
                                    getSemesterIDFromYearAndSemester(year, semester),
                                    oldSemester.title)
                                break
                            case "copySemester":
                                handleChange("copySemester",
                                    getSemesterIDFromYearAndSemester(year, semester),
                                    false, oldSemester, difference
                                );
                                break
                            case "moveSemester":
                                handleChange("moveSemester",
                                    getSemesterIDFromYearAndSemester(year, semester),
                                    false, oldSemester, difference
                                );
                                break
                            case "addSemester":
                                handleChange("addSemester",
                                    getSemesterIDFromYearAndSemester(year, semester),
                                    false, 0, ""
                                );
                                break
                        }
                        setOpenSemestersDialog(false);
                    },
                }}
            >
                <DialogTitle>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div>
                            {changeType === "copyModule" ? "Copy module to" :
                                changeType === "copySemester" ? "Copy semester to" :
                                    changeType === "moveSemester" ? "Move semester to" :
                                        "Create Semester"}
                        </div>

                        <div style={{ marginLeft: 'auto' }}>
                            {SemesterPicker(year, setYear, semester, setSemester)}
                            {changeType === "moveSemester" && <TextField
                                label="Day difference"
                                value={difference}
                                type='number'
                                onChange={(event) => setDifference(event.target.value)}
                                sx={{ mt: marginTop }}
                            />}
                        </div>
                    </div>
                </DialogTitle>

                <DialogActions>
                    <Button onClick={() => setOpenSemestersDialog(false)}>Cancel</Button>
                    <Button type="submit">{(changeType === "copyModule" || changeType === "copySemester") ? "Copy" :
                        changeType === "moveSemester" ? "Move" : "Create"}</Button>
                </DialogActions>

            </Dialog>
        </div>

    );
}
