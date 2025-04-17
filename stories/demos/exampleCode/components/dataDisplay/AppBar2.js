//////////////////////////////////////////////////////////////
// Website content

import React from 'react'
import { isUndefined } from 'lodash'
import moment from 'moment'
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FilterListIcon from '@mui/icons-material/FilterList';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import FlashOffIcon from '@mui/icons-material/FlashOff';
import TerminalIcon from '@mui/icons-material/Terminal';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { Switch, Tooltip } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { DatePicker } from '@mui/x-date-pickers';

import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../../../src/addons/dragAndDrop/styles.scss'

import { getSemesterIDFromDate } from '../tools/functions'
import { noPeriodDefault, selectProps, drawerWidth } from './../settings/settings'
import { LongMenu2 } from '../userInteraction/LongMenu'
import { updatePeriodWithDate2 } from './../dataDisplay/navigation'
import { undo, redo } from '../dataManagement/dataChange'
import { getModules } from './getData'
import { buildModule } from '../dataManagement/dataImport';

const AppBar2 = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

// //////////////////////////////////////////////////////////////
// AppBar

export function AppBarFunction(openDrawer, openSettingsDrawer, openFilterDrawer,
  semestersMap, handleDownloadData,
  undoStack, redoStack, currentModule, visibleDate, setVisibleDate, period,
  visibleAppointments, setDrawerOpen, setOpenSettingsDrawer, setOpenFilterDrawer, setSelected,
  setEditMode, analyzeAllConflicts,
  setWelcomeDialogOpen, setCurrentModule, setPeriod, setDropFieldIsVisible, dropFieldIsVisible,
  developerMode, setDeveloperMode, openAlertDialog,
  setAnalyzeAllConflicts, updateEditingView, handleOpenGroupingDialog,
  processFilter22, findAllConflicts, getFilteredAppointments2, filterIsEmpty, analyzeConflictsForOne, setAnalyzeConflictsForOne
) {
  // console.log("AppBarFunction", semestersMap)
  const currentSemesterID = getSemesterIDFromDate(visibleDate)


  const updatePeriodWithDate = (d) => {
    const filteredAppointments = getFilteredAppointments2(d)
    updatePeriodWithDate2(d, semestersMap, setVisibleDate, setPeriod, setEditMode, setSelected,
      filteredAppointments, processFilter22)
  }

  const handleModuleChange = (event, newValue) => {
    console.log("handleModuleChange")
    setCurrentModule(newValue)
    setDrawerOpen(true)
    const currentSemester = semestersMap[currentSemesterID]
    let moduleAppointments = []
    if (!isUndefined(currentSemester)) {
      const cM = currentSemester[newValue]
      console.log("cM2", cM)
      if (!isUndefined(cM)) { // Todo: It always should be defined.
        moduleAppointments = [...cM.lectures, ...cM.tutorials, ...cM.exams, ...cM.others].sort((a, b) => a.type - b.type)
      }
    }
    console.log("moduleAppointments", moduleAppointments);
    const firstAppointment = moduleAppointments.find(a => !isUndefined(a.id))
    if (firstAppointment) {
      updateEditingView(firstAppointment);
    } else {
      if (!getModules(currentSemester).includes(newValue)) {
        handleChange("addModule", buildModule(
          currentSemesterID, "LV-unknown", newValue, "unknown",
          false, true, 2, "FB12", "unknown", 0,
          [], [], [], []
        ), false, currentSemesterID, newValue) // Todo
      }
    }
  };

  return <AppBar2 position="fixed" open={openDrawer || openSettingsDrawer || openFilterDrawer}>
    <Toolbar>
      {/* <LongMenu semestersMap={semestersMap} /> */}
      {LongMenu2(setWelcomeDialogOpen, setEditMode, setSelected, setDrawerOpen, openDrawer,
        openAlertDialog, setCurrentModule, setPeriod, setDropFieldIsVisible, dropFieldIsVisible,
        developerMode, setOpenFilterDrawer, openFilterDrawer, setOpenSettingsDrawer,
        openSettingsDrawer, setDeveloperMode, visibleAppointments, handleOpenGroupingDialog,
        handleDownloadData)}

      {!(openDrawer || openSettingsDrawer || openFilterDrawer) && <Typography variant="h6" component="div">
        Interactive Schedule Planner
      </Typography>}

      <Typography sx={{ flexGrow: 1 }} />

      <Tooltip title="Undo">
        <IconButton color={undoStack.length === 0 ? "default" : "inherit"}
          onClick={undo()}>
          <UndoIcon fontSize='large' />
        </IconButton>
      </Tooltip>
      <Tooltip title="Redo">
        <IconButton color={redoStack.length === 0 ? "default" : "inherit"}
          onClick={redo()}>
          <RedoIcon fontSize='large' />
        </IconButton>
      </Tooltip>

      <Autocomplete
        id="module-title-in-appbar"
        options={getModules(semestersMap[currentSemesterID])}
        value={currentModule}
        onChange={handleModuleChange}
        sx={{ width: 240, ...selectProps }}
        getOptionLabel={(option) => option}
        freeSolo
        autoSelect
        renderInput={(params) => (
          <TextField {...params} label="Module" />
        )}
      />
      <DatePicker
        name="goToDate"
        value={moment(visibleDate)}
        onChange={(newValue) => {
          setVisibleDate(newValue.toDate()); updatePeriodWithDate(newValue.toDate())
        }}
        onAccept={(newValue) => {
          setVisibleDate(newValue.toDate()); updatePeriodWithDate(newValue.toDate())
        }}
        color="white"
        sx={{ ml: 1, mr: 1, width: 150, ...selectProps }} />
      <FormControl sx={{ width: 240, ...selectProps }}>
        <InputLabel id="period-select-label">Period</InputLabel>
        <Select
          labelId="period-select-label"
          id="period-select"
          value={period}
          label="Period"
          onChange={(p) => {
            const periodId = p.target.value
            updatePeriodWithDate(periodId ? (semestersMap[currentSemesterID]["Periods"].others.find((p) => (p.id === periodId))).start : visibleDate)
            setPeriod(periodId)
          }}
          name="period"
        >
          {(isUndefined(semestersMap[currentSemesterID]) ? [noPeriodDefault] : semestersMap[currentSemesterID]["Periods"].others).map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {developerMode && <Tooltip title="Show appointments in console">
        <IconButton color="inherit" onClick={() => {
          console.log("visibleAppointments", visibleAppointments)
          console.log("semestersMap", semestersMap)
        }}>
          <TerminalIcon fontSize='large' />
        </IconButton>
      </Tooltip>}

      <Tooltip title="Manage Groupings">
        <IconButton color="inherit" onClick={() => {
          handleOpenGroupingDialog("Modules")
        }}>
          <ManageSearchIcon fontSize='large' />
        </IconButton>
      </Tooltip>

      <Tooltip title="Filter">
        <IconButton color={filterIsEmpty()
          ? "inherit"
          : "secondary"}
          onClick={() => { setDrawerOpen(false); setOpenSettingsDrawer(false); setOpenFilterDrawer(!openFilterDrawer) }}>
          <FilterListIcon fontSize='large' />
        </IconButton>
      </Tooltip>

      {/* <Tooltip title="Tools">
        <IconButton color="inherit" onClick={() => {
          console.log("To be implemented")
        }}>
          <ConstructionIcon fontSize='large' />
        </IconButton>
      </Tooltip> */}

      <Tooltip title="Settings">
        <IconButton color="inherit" onClick={() => { setOpenFilterDrawer(false); setDrawerOpen(false); setOpenSettingsDrawer(!openSettingsDrawer) }}>
          <SettingsIcon fontSize='large' />
        </IconButton>
      </Tooltip>
      {analyzeAllConflicts ?
        <Tooltip title="All Conflicts Off">
          <IconButton color="inherit" onClick={() => { setAnalyzeAllConflicts(false); setSelected(null) }}>
            <FlashOffIcon fontSize='large' />
          </IconButton>
        </Tooltip>

        :
        <Tooltip title="Find All Conflicts">
          <IconButton color="inherit" onClick={() => { findAllConflicts() }}>
            <FlashOnIcon fontSize='large' />
          </IconButton>
        </Tooltip>}

      <Tooltip title={"Analyze conflicts for one appointment" + (analyzeConflictsForOne ? ": On" : ": Off")}>
        <Switch
          color="primary.light"
          checked={analyzeConflictsForOne}
          onChange={(event) => { setAnalyzeConflictsForOne(event.target.checked) }}
          inputProps={{ 'aria-label': 'controlled' }} />
      </Tooltip>


      <Tooltip title="Edit">
        <IconButton
          fontSize='large'
          color="inherit"
          aria-label="open drawer"
          edge="end"
          onClick={() => { setOpenFilterDrawer(false); setOpenSettingsDrawer(false); setDrawerOpen(true) }}
          sx={{ ...(openDrawer && { display: 'none' }) }}
        >
          <EditIcon fontSize='large' />
        </IconButton>
      </Tooltip>

      {openDrawer &&
        <Tooltip title="Close Sidebar">
          <IconButton color="inherit" fontSize='large' onClick={() => setDrawerOpen(false)}>
            <ChevronRightIcon fontSize='large' />
          </IconButton>
        </Tooltip>}

    </Toolbar>
  </AppBar2>

}

