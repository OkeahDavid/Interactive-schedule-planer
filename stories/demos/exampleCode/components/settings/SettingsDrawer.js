import React from 'react'
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Drawer from '@mui/material/Drawer';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';


import { styled, useTheme } from '@mui/material/styles';
// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../../../src/addons/dragAndDrop/styles.scss'


import {
  noPeriodDefault, MenuProps, allViews, selectProps,
  DrawerHeader, drawerWidth, drawerHalfWidth, marginTop
} from './../settings/settings'
import { Divider } from '@mui/material';



export function SettingsDrawer(openSettingsDrawer, undoNumber, setUndoNumber, warnSwitch, setWarnSwitch,
  dayStart, setDayStart, dayEnd, setDayEnd, granularity, setGranularity, timeslots, setTimeSlots,
  showAllConflicts, setShowAllConflicts, showRoomConflicts, setShowRoomConflicts,
  showTutorialConflicts, setShowTutorialConflicts, showPreviousYearConflicts, setShowPreviousYearConflicts,
  showNextYearConflicts, setShowNextYearConflicts, showSameSemesterConflicts, setShowSameSemesterConflicts,
  showLecturerConflicts, setShowLecturerConflicts, showTutorialLectureConflicts, setShowTutorialLectureConflicts) {
  // console.log("SettingsDrawer")
  return <Drawer
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        width: drawerWidth,
      },
    }}
    variant="persistent"
    anchor="right"
    open={openSettingsDrawer}
    // disableEnforceFocus
    PaperProps={{
      component: 'form',
      onSubmit: (ev) => console.log("To be implemented"),
    }}
  >
    <DrawerHeader> Settings </DrawerHeader>
    <div style={{ display: 'flex', alignItems: 'center' }}>

      <div>
        <TextField
          fullWidth id="undo-number"
          label="Undo Number"
          name="undo_number"
          value={undoNumber}
          type="number"
          onChange={(event) => { setUndoNumber(event.target.value) }}
          sx={{ width: drawerHalfWidth, mt: marginTop }} />
      </div>

      <div style={{ marginLeft: 'auto', marginRight: '10px' }}>
        <FormControlLabel
          // value="start"
          control={<Switch
            color="primary"
            checked={warnSwitch}
            onChange={(event) => { setWarnSwitch(event.target.checked) }}
            inputProps={{ 'aria-label': 'controlled' }} />}
          label="Warn"
          labelPlacement="start" />
      </div>
    </div>

    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>
        <TextField
          sx={{ mt: marginTop, ml: 1, width: 100, ...selectProps }}
          fullWidth id="daystart-number"
          label="Day start"
          name="daystart_number"
          value={dayStart.getHours()}
          type="number"
          onChange={(event) => { setDayStart(new Date(new Date(dayStart).setHours(event.target.value))) }} />
      </div>
      <div>
        <TextField
          sx={{ mt: marginTop, ml: 1, width: 100, ...selectProps }}
          fullWidth id="dayend-number"
          label="Day end"
          name="dayend_number"
          value={dayEnd.getHours()}
          type="number"
          onChange={(event) => { setDayEnd(new Date(new Date(dayEnd).setHours(event.target.value))) }} />
      </div>
    </div>

    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div>
        <FormControl sx={{ mt: marginTop, ml: 1, width: 100, ...selectProps }}>
          <InputLabel id="granularity-select-label">Granularity</InputLabel>
          <Select
            labelId="granularity-select-label"
            id="granularity-select"
            value={granularity}
            label="Granularity"
            onChange={(event) => setGranularity(event.target.value)}
            name="granularity"
          >
            <MenuItem value={15}>15 min</MenuItem>
            <MenuItem value={30}>30 min</MenuItem>
            <MenuItem value={60}>60 min</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div>
        <TextField
          sx={{ mt: marginTop, ml: 1, width: 100, ...selectProps }}
          fullWidth id="timeslots-number"
          label="Timeslots"
          name="timeslots_number"
          value={timeslots}
          type="number"
          onChange={(event) => { setTimeSlots(event.target.value > 0 ? event.target.value : 1) }} />
      </div>
    </div>
    <Divider sx={{ mt: marginTop }} />
    <Divider sx={{ mt: 0.1 }} />
    <div style={{ marginLeft: 'auto', marginRight: '10px', marginTop: marginTop * 2, alignItems: 'center' }}>
      <FormControlLabel
        control={<Switch
          color="primary"
          checked={showAllConflicts}
          onChange={(event) => {
            const checked = event.target.checked;
            setShowAllConflicts(checked)
            setShowLecturerConflicts(checked)
            setShowSameSemesterConflicts(checked)
            setShowPreviousYearConflicts(checked)
            setShowNextYearConflicts(checked)
            setShowTutorialLectureConflicts(checked)
            setShowTutorialConflicts(checked)
            setShowRoomConflicts(checked)
          }}
          inputProps={{ 'aria-label': 'controlled' }} />}
        label="Show all conflicts"
        labelPlacement="start"
      />
    </div>
    <Divider />
    <div style={{ marginLeft: 'auto', marginRight: '10px', alignItems: 'center' }}>
      <FormControlLabel
        control={<Switch
          color="primary"
          checked={showLecturerConflicts}
          onChange={(event) => { setShowLecturerConflicts(event.target.checked) }}
          inputProps={{ 'aria-label': 'controlled' }} />}
        label="Show lecturer conflicts"
        labelPlacement="start"
      />
    </div>
    <div style={{ marginLeft: 'auto', marginRight: '10px', alignItems: 'center' }}>
      <FormControlLabel
        control={<Switch
          color="primary"
          checked={showSameSemesterConflicts}
          onChange={(event) => { setShowSameSemesterConflicts(event.target.checked) }}
          inputProps={{ 'aria-label': 'controlled' }} />}
        label="Show same semester conflicts"
        labelPlacement="start"
      />
    </div>
    <div style={{ marginLeft: 'auto', marginRight: '10px', alignItems: 'center' }}>
      <FormControlLabel
        control={<Switch
          color="primary"
          checked={showPreviousYearConflicts}
          onChange={(event) => { setShowPreviousYearConflicts(event.target.checked) }}
          inputProps={{ 'aria-label': 'controlled' }} />}
        label="Show previous year conflicts"
        labelPlacement="start"
      />
    </div>
    <div style={{ marginLeft: 'auto', marginRight: '10px', alignItems: 'center' }}>
      <FormControlLabel
        control={<Switch
          color="primary"
          checked={showNextYearConflicts}
          onChange={(event) => { setShowNextYearConflicts(event.target.checked) }}
          inputProps={{ 'aria-label': 'controlled' }} />}
        label="Show next year conflicts"
        labelPlacement="start"
      />
    </div>
    <div style={{ marginLeft: 'auto', marginRight: '10px', alignItems: 'center' }}>
      <FormControlLabel
        control={<Switch
          color="primary"
          checked={showTutorialLectureConflicts}
          onChange={(event) => { setShowTutorialLectureConflicts(event.target.checked) }}
          inputProps={{ 'aria-label': 'controlled' }} />}
        label="Show tutorial-lecture conflicts"
        labelPlacement="start"
      />
    </div>
    <div style={{ marginLeft: 'auto', marginRight: '10px', alignItems: 'center' }}>
      <FormControlLabel
        control={<Switch
          color="primary"
          checked={showTutorialConflicts}
          onChange={(event) => { setShowTutorialConflicts(event.target.checked) }}
          inputProps={{ 'aria-label': 'controlled' }} />}
        label="Show tutorial conflicts"
        labelPlacement="start"
      />
    </div>
    <div style={{ marginLeft: 'auto', marginRight: '10px', alignItems: 'center' }}>
      <FormControlLabel
        control={<Switch
          color="primary"
          checked={showRoomConflicts}
          onChange={(event) => { setShowRoomConflicts(event.target.checked) }}
          inputProps={{ 'aria-label': 'controlled' }} />}
        label="Show room conflicts"
        labelPlacement="start"
      />
    </div>

  </Drawer>
}

