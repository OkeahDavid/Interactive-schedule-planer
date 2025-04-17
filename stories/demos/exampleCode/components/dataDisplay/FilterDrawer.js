import React, { useState } from 'react'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import CancelIcon from '@mui/icons-material/Cancel';

// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../../../src/addons/dragAndDrop/styles.scss'

import { getSemesterIDFromDate, getStyles } from '../tools/functions'
import { MenuProps, DrawerHeader, drawerWidth, marginTop } from '../settings/settings'
import { getFilteredAppointments } from './filter'
import { getModules } from './getData'
import { getAppointmentsFromSemester } from './getData'





export function FilterDrawer(openFilterDrawer, filterPeriods, filterStudyplans, filterModules, filterTypes,
  filterRhythms, filterLecturers, filterRooms, filterParticipants, filterAppointments, filterDraggable,
  setFeature1, setFeature2, setFeature3, setFeature4, setFeature5, setFeature6, setFeature7, setFeature8,
  setFeature9, setFilterDraggable, visibleDate,
  studyplans, lecturers, rooms,
  semestersMap, period,
  processFilter22) {
  // console.log("FilterDrawer", semestersMap)
  const currentSemesterID = getSemesterIDFromDate(visibleDate)
  const currentSemester = semestersMap[currentSemesterID];


  function MultipleSelectChip(props) {
    const [openSelect, setOpenSelect] = useState(false);
    const { feature, items } = props

    const theme = useTheme();

    const handleChipChange = (event) => {
      console.log(event)
      const { target: { value }, } = event;
      // On autofill we get a stringified value.
      const input = typeof value === 'string' ? value.split(',') : value
      updateFilter(input)
      // Todo: Narrow possible filter options based on already set filters.
    };

    const handleDelete = (valueToDelete) => {
      switch (feature) {
        case "Periods":
          updateFilter(filterPeriods.filter(value => value !== valueToDelete));
          break;
        case "Studyplans":
          updateFilter(filterStudyplans.filter(value => value !== valueToDelete));
          break;
        case "Modules":
          updateFilter(filterModules.filter(value => value !== valueToDelete));
          break;
        case "Types":
          updateFilter(filterTypes.filter(value => value !== valueToDelete));
          break;
        case "Rhythms":
          updateFilter(filterRhythms.filter(value => value !== valueToDelete));
          break;
        case "Lecturers":
          updateFilter(filterLecturers.filter(value => value !== valueToDelete));
          break;
        case "Rooms":
          updateFilter(filterRooms.filter(value => value !== valueToDelete));
          break;
        case "Participants":
          updateFilter(filterParticipants.filter(value => value !== valueToDelete));
          break;
        case "Appointments":
          updateFilter(filterAppointments.filter(value => value !== valueToDelete));
          break;
        case "Draggability":
          updateFilter(filterDraggable.filter(value => value !== valueToDelete));
          break;
        default:
          console.error("Wrong feature to delete!")
      }
    }

    function updateFilter(input) {
      switch (feature) {
        case "Periods":
          setFeature1(input)
          processFilter22(visibleDate, period, getFilteredAppointments(currentSemester, currentSemesterID, studyplans, input, filterStudyplans, filterModules, filterTypes, filterRhythms, filterLecturers, filterRooms, filterParticipants, filterAppointments, filterDraggable))
          break
        case "Studyplans":
          setFeature2(input)
          processFilter22(visibleDate, period, getFilteredAppointments(currentSemester, currentSemesterID, studyplans, filterPeriods, input, filterModules, filterTypes, filterRhythms, filterLecturers, filterRooms, filterParticipants, filterAppointments, filterDraggable))
          break
        case "Modules":
          setFeature3(input)
          processFilter22(visibleDate, period, getFilteredAppointments(currentSemester, currentSemesterID, studyplans, filterPeriods, filterStudyplans, input, filterTypes, filterRhythms, filterLecturers, filterRooms, filterParticipants, filterAppointments, filterDraggable))
          break
        case "Types":
          setFeature4(input)
          processFilter22(visibleDate, period, getFilteredAppointments(currentSemester, currentSemesterID, studyplans, filterPeriods, filterStudyplans, filterModules, input, filterRhythms, filterLecturers, filterRooms, filterParticipants, filterAppointments, filterDraggable))
          break
        case "Rhythms":
          setFeature5(input)
          processFilter22(visibleDate, period, getFilteredAppointments(currentSemester, currentSemesterID, studyplans, filterPeriods, filterStudyplans, filterModules, filterTypes, input, filterLecturers, filterRooms, filterParticipants, filterAppointments, filterDraggable))
          break
        case "Lecturers":
          setFeature6(input)
          processFilter22(visibleDate, period, getFilteredAppointments(currentSemester, currentSemesterID, studyplans, filterPeriods, filterStudyplans, filterModules, filterTypes, filterRhythms, input, filterRooms, filterParticipants, filterAppointments, filterDraggable))
          break
        case "Rooms":
          setFeature7(input)
          processFilter22(visibleDate, period, getFilteredAppointments(currentSemester, currentSemesterID, studyplans, filterPeriods, filterStudyplans, filterModules, filterTypes, filterRhythms, filterLecturers, input, filterParticipants, filterAppointments, filterDraggable))
          break
        case "Participants":
          setFeature8(input)
          processFilter22(visibleDate, period, getFilteredAppointments(currentSemester, currentSemesterID, studyplans, filterPeriods, filterStudyplans, filterModules, filterTypes, filterRhythms, filterLecturers, filterRooms, input, filterAppointments, filterDraggable))
          break
        case "Appointments":
          setFeature9(input)
          processFilter22(visibleDate, period, getFilteredAppointments(currentSemester, currentSemesterID, studyplans, filterPeriods, filterStudyplans, filterModules, filterTypes, filterRhythms, filterLecturers, filterRooms, filterParticipants, input, filterDraggable))
          break
        case "Draggability":
          setFilterDraggable(input)
          processFilter22(visibleDate, period, getFilteredAppointments(currentSemester, currentSemesterID, studyplans, filterPeriods, filterStudyplans, filterModules, filterTypes, filterRhythms, filterLecturers, filterRooms, filterParticipants, filterAppointments, input))
          break
        default:
          console.error("Wrong feature!")
      }
    }

    const changeOpen = (bool) => {
      setOpenSelect(bool)
      // switch (feature) {
      //   case "Periods":
      //     setOpenSelect1(bool)
      //     break;
      //   case "Studyplans":
      //     setOpenSelect2(bool)
      //     break;
      //   case "Modules":
      //     setOpenSelect3(bool)
      //     break;
      //   case "Types":
      //     setOpenSelect4(bool)
      //     break;
      //   case "Rhythms":
      //     setOpenSelect5(bool)
      //     break;
      //   case "Lecturers":
      //     setOpenSelect6(bool)
      //     break;
      //   case "Rooms":
      //     setOpenSelect7(bool)
      //     break;
      //   case "Participants":
      //     setOpenSelect8(bool)
      //     break;
      //   case "Appointments":
      //     setOpenSelect9(bool)
      //     break;
      //   default:
      //     console.error("Wrong feature to open!")
      // }
    }

    return (
      <div>
        <FormControl fullWidth sx={{ mt: marginTop }} >
          <InputLabel id="demo-multiple-chip-label">{feature}</InputLabel>
          <Select
            labelId="demo-multiple-chip-label"
            id="demo-multiple-chip"
            multiple
            value={feature === "Periods" ? filterPeriods :
              feature === "Studyplans" ? filterStudyplans :
                feature === "Modules" ? filterModules :
                  feature === "Types" ? filterTypes :
                    feature === "Rhythms" ? filterRhythms :
                      feature === "Lecturers" ? filterLecturers :
                        feature === "Rooms" ? filterRooms :
                          feature === "Participants" ? filterParticipants :
                            feature === "Appointments" ? filterAppointments :
                              feature === "Draggability" ? filterDraggable :
                                ["Error"]}
            onChange={(handleChipChange)}
            open={openSelect}
            // open={feature === "Periods" ? openSelect1 :
            //   feature === "Studyplans" ? openSelect2 :
            //     feature === "Modules" ? openSelect3 :
            //       feature === "Types" ? openSelect4 :
            //         feature === "Rhythms" ? openSelect5 :
            //           feature === "Lecturers" ? openSelect6 :
            //             feature === "Rooms" ? openSelect7 :
            //               feature === "Participants" ? openSelect8 :
            //                 feature === "Appointments" ? openSelect9 :
            //                   false}
            onOpen={() => changeOpen(true)}
            onClose={() => changeOpen(false)}
            input={<OutlinedInput id="select-multiple-chip" label={feature} />}
            renderValue={(selectedFilterItems) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selectedFilterItems.map((value) => (
                  <Chip key={value} label={value} onDelete={() => handleDelete(value)}
                    deleteIcon={
                      <CancelIcon
                        onMouseDown={(event) => {
                          event.stopPropagation();
                        }}
                      />
                    }
                  />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {items.map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, filterPeriods, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    );
  }
  return <Drawer name="filterdrawer"
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        width: drawerWidth,
      },
    }}
    variant="persistent"
    anchor="right"
    open={openFilterDrawer}
    // disableEnforceFocus
    PaperProps={{
      component: 'form',
      onSubmit: () => { },
    }}
  >
    <DrawerHeader>
      Filter

      <Typography sx={{ flexGrow: 1 }} />

      <Tooltip title="Clear Filter">
        <IconButton color={filterPeriods.length + filterStudyplans.length + filterModules.length + filterTypes.length + filterRhythms.length + filterLecturers.length + filterRooms.length + filterParticipants.length + filterAppointments.length + filterDraggable.length === 0
          ? "inherit"
          : "secondary"}
          onClick={() => {
            setFeature1([])
            setFeature2([])
            setFeature3([])
            setFeature4([])
            setFeature5([])
            setFeature6([])
            setFeature7([])
            setFeature8([])
            setFeature9([])
            setFilterDraggable([])
            processFilter22(visibleDate, period, getAppointmentsFromSemester(currentSemester))
          }}>
          <FilterListOffIcon fontSize='large' />
        </IconButton>
      </Tooltip>

    </DrawerHeader>

    {/* <MultipleSelectChip feature="Periods" items={periods.map(p => p.title)} /> */}
    <MultipleSelectChip feature="Studyplans" items={Object.keys(studyplans)} />
    <MultipleSelectChip feature="Modules" items={getModules(currentSemester)} />
    <MultipleSelectChip feature="Types" items={["Lecture", "Tutorial", "Exam", "Block", "Seminar", "Test", "Other"]} />
    <MultipleSelectChip feature="Rhythms" items={["Single", "Daily", "Weekly", "Bi-Weekly", "Monthly", "Irregularly"]} />
    <MultipleSelectChip feature="Lecturers" items={lecturers} />
    <MultipleSelectChip feature="Rooms" items={rooms} />
    <MultipleSelectChip feature="Participants" items={["> 50", "> 100", "> 150", "> 200", "> 250", "> 300", "> 400", "> 500"]} />
    <MultipleSelectChip feature="Draggability" items={["Draggable", "NonDraggable"]} />
    <MultipleSelectChip feature="Appointments" items={["ToBeImplemented"]} />

  </Drawer>
}

