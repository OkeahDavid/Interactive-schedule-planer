//////////////////////////////////////////////
//// Periods dialog

import React from 'react'
import moment from 'moment'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DatePicker } from '@mui/x-date-pickers';

// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../../../../src/addons/dragAndDrop/styles.scss'

import { marginTop } from '../../settings/settings'



export function PeriodsDialog(currentSemesterID, periodStartDate2, periodEndDate2, periodTitle, modifyPeriod,
    openPeriodsDialog, setOpenPeriodsDialog, handleChange,
    setVisibleDate, setPeriod, setEditMode, setSelected,
    setPeriodTitle, setPeriodStartDate2, setPeriodEndDate2
) {

    return (
        <div>
            <Dialog
                open={openPeriodsDialog}
                onClose={() => setOpenPeriodsDialog(false)}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        console.warn("Adding periods has not been implemented properly. It is not needed, and may break the app logic.")
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const title9 = formJson.periodtitle;
                        const starttime = formJson.periodstart;
                        const endtime = formJson.periodend;

                        // Creating new period
                        let periodAppointment = {
                            module: "Periods",
                            title: title9.toString(),
                            type: 444,
                            start: moment(starttime, "DD.MM.YYYY").toDate(),
                            end: moment(endtime, "DD.MM.YYYY").add(1, 'day').toDate(),
                            allDay: true,
                            isDraggable: false,
                        }

                        if (modifyPeriod) {
                            handleChange("replace", { ...periodAppointment, id: period }, false, currentSemesterID, "Periods");
                        } else {
                            handleChange("add", periodAppointment, false, currentSemesterID, "Periods");
                        }
                        setVisibleDate(periodAppointment.start)
                        setPeriod(periodAppointment.id)
                        setEditMode(false)
                        setSelected(null)
                        setOpenPeriodsDialog(false);
                    },
                }}
            >
                <DialogTitle>
                    Define a Period
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth id="period-title"
                        label="Period Title"
                        name="periodtitle"
                        value={periodTitle}
                        onChange={(newValue) => { setPeriodTitle(newValue.target.value) }}
                        sx={{ mt: marginTop }}
                    />
                    <DatePicker label="Start" name="periodstart"
                        sx={{ mt: marginTop }}
                        value={periodStartDate2}
                        onChange={(newValue) => { setPeriodStartDate2(newValue) }}
                        onAccept={(newValue) => { setPeriodStartDate2(newValue) }}
                    />
                    <DatePicker label="End" name="periodend"
                        sx={{ mt: marginTop }}
                        value={periodEndDate2}
                        onChange={(newValue) => { setPeriodEndDate2(newValue) }}
                        onAccept={(newValue) => { setPeriodEndDate2(newValue) }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPeriodsDialog(false)}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </DialogActions>
            </Dialog>
        </div>

    );
}

