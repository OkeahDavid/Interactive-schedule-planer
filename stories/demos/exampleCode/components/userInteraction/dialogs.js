import React, { Fragment } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import '../../../../../src/addons/dragAndDrop/styles.scss'

import { DropField } from '../dataManagement/dataImport'


export function AlertDialog({ titleText, bodyText, cancelText, actionText, open, onClose, onAction }) {
    //////////////////////////////////////////////////////////////
    // Dialogs / Input




    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle id="alert-dialog-title">{titleText || "[Title]"}</DialogTitle>
                <DialogActions>
                    <Button onClick={onClose}>{cancelText || "[Cancel]"}</Button>
                    <Button onClick={() => { onAction(); onClose() }}>{actionText || "[Action]"}</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

export function WelcomeDialog(openWelcomeDialog, setWelcomeDialogOpen, handleOpenGroupingDialog,
    setDropFieldIsVisible, handleChange, semestersMap, showAlertMessage, developerMode) {
    // console.log("WelcomeDialog", semestersMap)

    // Todo: Alexander: Somewhere here it should be checked, if there are unsaved changes
    // and then a warning should be triggered with showAlertMessage.
    return (
        <div>
            <Dialog
                open={openWelcomeDialog}
                onClose={() =>
                    setWelcomeDialogOpen(false)
                }
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        setWelcomeDialogOpen(false);
                    },
                }}
            >
                <DialogTitle>Welcome!</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        • Click an appointment to analyze conflicts.
                        <br></br>
                        • Hover over an appointment to see conflict causes.
                        <br></br>
                        • Edit an appointment by opening the editing sidebar.
                        <br></br>
                        • Hover over an icon to see tooltips.
                        <br></br>
                        • When downloading the human readable data, you can decide what will be downloaded by setting filters.
                        <br></br><br></br>
                    </DialogContentText>
                    {DropField(setWelcomeDialogOpen, handleOpenGroupingDialog, developerMode,
                        setDropFieldIsVisible, handleChange, semestersMap, showAlertMessage)}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setWelcomeDialogOpen(false)
                    }>Start from Scratch</Button>
                    <Button onClick={() => setWelcomeDialogOpen(false)
                        // Todo: Alexander: When this button is clicked, the last snapshot should be loaded, that has been saved when downloading the data.
                    }>Continue with last Session</Button>

                </DialogActions>
            </Dialog>
        </div>
    );
}
