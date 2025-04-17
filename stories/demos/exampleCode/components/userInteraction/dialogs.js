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

    // Check if there are unsaved changes when opening the welcome dialog
    React.useEffect(() => {
        if (openWelcomeDialog) {
            // Check for unsaved changes in localStorage
            const hasUnsavedChanges = localStorage.getItem('isp_has_unsaved_changes') === 'true';
            const lastChangeTimestamp = localStorage.getItem('isp_last_change_timestamp');
            
            if (hasUnsavedChanges && lastChangeTimestamp) {
                // Calculate how old the changes are
                const lastChangeDate = new Date(lastChangeTimestamp);
                const timeSinceLastChange = Date.now() - lastChangeDate.getTime();
                const minutesSinceLastChange = Math.floor(timeSinceLastChange / 60000);
                
                // Show a warning message about unsaved changes
                showAlertMessage(
                    'warning', 
                    `You have unsaved changes from ${minutesSinceLastChange} minute${minutesSinceLastChange === 1 ? '' : 's'} ago. Consider using "Continue with last Session" to restore them.`
                );
            }
        }
    }, [openWelcomeDialog, showAlertMessage]);

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
                    <Button onClick={() => {
                        // Clear any autosaved data if starting from scratch
                        localStorage.removeItem('isp_autosave_snapshot');
                        localStorage.setItem('isp_has_unsaved_changes', 'false');
                        setWelcomeDialogOpen(false);
                    }}>Start from Scratch</Button>
                    <Button onClick={() => {
                        // Load the last snapshot
                        const lastCompleteSnapshot = localStorage.getItem('isp_complete_snapshot');
                        const lastAutoSaveSnapshot = localStorage.getItem('isp_autosave_snapshot');
                        
                        if (lastCompleteSnapshot || lastAutoSaveSnapshot) {
                            try {
                                // Prefer the complete snapshot if available, otherwise use autosave
                                let dataToLoad = null;
                                
                                if (lastCompleteSnapshot) {
                                    const parsedSnapshot = JSON.parse(lastCompleteSnapshot);
                                    dataToLoad = parsedSnapshot.data;
                                    showAlertMessage('success', `Loaded data from ${new Date(parsedSnapshot.timestamp).toLocaleString()}`);
                                } else {
                                    const parsedSnapshot = JSON.parse(lastAutoSaveSnapshot);
                                    dataToLoad = parsedSnapshot.state;
                                    showAlertMessage('success', `Loaded auto-saved data from ${new Date(parsedSnapshot.timestamp).toLocaleString()}`);
                                }
                                
                                // Apply the loaded data through handleChange
                                if (dataToLoad) {
                                    handleChange(dataToLoad, true);
                                }
                            } catch (error) {
                                console.error('Failed to load saved session:', error);
                                showAlertMessage('error', 'Failed to load the last session data');
                            }
                        } else {
                            showAlertMessage('info', 'No previous session data found');
                        }
                        
                        setWelcomeDialogOpen(false);
                    }}>Continue with last Session</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
