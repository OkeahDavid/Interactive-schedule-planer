// Menu
import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../../../src/addons/dragAndDrop/styles.scss'

import { generateSchedulePDF } from '../dataManagement/dataExport';



export const ITEM_HEIGHT = 48;
export const menuOptions = [
    'Return to welcome screen',
    'Upload file',
    'Download data',
    'Download human readable form',
    'Filter',
    'Manage data',
    'Create new appointment',
    'Delete all appointments',
    'Display options',
    'Auto save options',
    'Developer mode',
];


export function LongMenu2(setWelcomeDialogOpen, setEditMode, setSelected, setDrawerOpen, openDrawer,
    openAlertDialog, setCurrentModule, setPeriod, setDropFieldIsVisible, dropFieldIsVisible,
    developerMode, setOpenFilterDrawer, openFilterDrawer, setOpenSettingsDrawer,
    openSettingsDrawer, setDeveloperMode, visibleAppointments, handleOpenGroupingDialog,
    handleDownloadData) {
    const [anchorEl, setAnchorEl] = useState(null)
    const openLongMenu = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleMenuItemClick = (option) => {
        switch (option) {
            case 'Return to welcome screen':
                setWelcomeDialogOpen(true)
                break
            case 'Create new appointment':
                setEditMode(false)
                setSelected(null)
                setDrawerOpen(!openDrawer)
                break
            case 'Delete all appointments':
                openAlertDialog("Are you sure you want to delete all your appointments?",
                    "Cancel",
                    "Delete ALL",
                    () => {
                        handleChange("deleteAll", [], false, 0, "")
                        setCurrentModule("No Module")
                        setPeriod(0)
                    })
                break
            case 'Manage data':
                handleOpenGroupingDialog("Semesters")
                break
            case 'Upload file':
                console.log("Upload file", dropFieldIsVisible, developerMode)
                setDropFieldIsVisible(!dropFieldIsVisible || developerMode)
                break
            case 'Download data':
                handleDownloadData()
                break
            case 'Download human readable form':
                openAlertDialog("Only filtered appointments will be considered.",
                    "Cancel",
                    "Generate human readable form.",
                    () => { // Todo
                        generateSchedulePDF(visibleAppointments);
                    })
                break
            case 'Filter':
                setOpenFilterDrawer(!openFilterDrawer)
                break
            case 'Display options':
                setOpenSettingsDrawer(!openSettingsDrawer)
                break
            case 'Auto save options':
                setOpenSettingsDrawer(!openSettingsDrawer)
                console.log(option, "to be implemented!")
                break
            case 'Developer mode':
                setDeveloperMode(!developerMode)
                setDropFieldIsVisible(!developerMode)
                break
            default:
                break

        }
        handleClose()
    }

    return (
        <div>
            <IconButton
                size="large"
                edge="start"
                sx={{ mr: 2 }}
                aria-label="more" // "menu"
                color="inherit"
                id="long-button"
                aria-controls={openLongMenu ? 'long-menu' : undefined}
                aria-expanded={openLongMenu ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MenuIcon fontSize='large' />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={openLongMenu}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * menuOptions.length,
                        width: '34ch',
                    },
                }}
            >
                {menuOptions.map((option) => (
                    <MenuItem key={option} selected={option === 'Manage study plans'} onClick={() => handleMenuItemClick(option)}>
                        {option}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    )
}

