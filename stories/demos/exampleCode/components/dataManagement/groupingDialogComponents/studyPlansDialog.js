import React from 'react'
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



export function StudyPlanDialog(
    studyPlanTitle, setStudyPlanTitle, modifyStudyplan, handleChange,
    openStudyplansDialog, setOpenStudyplansDialog, oldName, studyplans,
    handleCalculateRows
) {
    return (
        <div>
            <Dialog
                open={openStudyplansDialog}
                onClose={() => setOpenStudyplansDialog(false)}
                PaperProps={{
                    component: 'form',
                    style: { width: '520px' },
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const newStudyplanTitle = formJson.studyplantitle;

                        // Creating new studyplan
                        let newStudyplan = {}
                        newStudyplan[newStudyplanTitle] = {}

                        if (modifyStudyplan) {
                            let tmp = studyplans[oldName]
                            newStudyplan[newStudyplanTitle] = tmp
                            handleChange("deleteStudyplan", oldName, false, 0, "Studyplans");
                        }
                        handleChange("addStudyplan", newStudyplan, modifyStudyplan, 0, "Studyplans");
                        setOpenStudyplansDialog(false);
                        handleCalculateRows({ ...studyplans, [newStudyplanTitle]: {} })
                    },
                }}
            >
                <DialogTitle>
                    Create / Rename Studyplan
                </DialogTitle>

                <DialogContent>
                    <DialogContentText></DialogContentText>
                    <TextField
                        fullWidth id="studyplan-title"
                        label="Studyplan Title"
                        name="studyplantitle"
                        value={studyPlanTitle}
                        onChange={(newValue) => { setStudyPlanTitle(newValue.target.value) }}
                        sx={{ mt: marginTop }}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenStudyplansDialog(false)}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </DialogActions>

            </Dialog>
        </div>

    );
}

