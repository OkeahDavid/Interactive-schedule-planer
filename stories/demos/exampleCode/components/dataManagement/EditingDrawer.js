import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { isUndefined, isNull } from 'lodash'
import moment from 'moment'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import JoinRightIcon from '@mui/icons-material/JoinRight';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Drawer from '@mui/material/Drawer';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../../../src/addons/dragAndDrop/styles.scss'

import { getSemesterIDFromDate, getSemesterStringFromAppointment, mapType } from '../tools/functions'
import { DrawerHeader, drawerHalfWidth, drawerWidth, marginTop } from './../settings/settings'
import { getModules } from './../dataDisplay/getData'
import AppointmentFields from './AppointmentFields';
import { buildModule } from './dataImport';



//////////////////////////////////////////////////////////////
// Sidebar

// Tabs




function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


function a11yProps2(index) {
  return {
    id: `simple-tab2-${index}`,
    'aria-controls': `simple-tabpanel2-${index}`,
  };
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

CustomTabPanel2.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box >{children}</Box>}
    </div>
  );
}

function CustomTabPanel2(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel2-${index}`}
      aria-labelledby={`simple-tab2-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}


export function EditingDrawer(
  openDrawer, selected,
  currentModule, rooms, developerMode, lecturers,
  setCurrentModule, editMode, setEditMode, handleChange,
  setSelected, openAlertDialog, deleteObject,
  semestersMap, visibleDate, setVisibleDate, updateEditingView
) {
  // console.log("EditingDrawer", semestersMap)

  const [mergeModule, setMergeModule] = useState("Don't merge")
  const [merge, setMerge] = useState(false)

  const [oldRhythm, setOldRhythm] = useState(selected ? selected.rhythm : 0);

  const [isPeriod, setIsPeriod] = useState(false)
  const [currentSemesterID, setCurrentSemesterID] = useState(getSemesterIDFromDate(visibleDate))

  const [tabValueA, setTabValueA] = useState(0);
  const [tabValueB, setTabValueB] = useState(0);
  const [items, setItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (selected) {
      console.log("selected has changed", selected.type, (selected.type / 10) - 1, selected)
      setIsEditing(false)
      setTabValueA(selected.type && selected.type < 40 ? (selected.type / 10) - 1 : 3)

      const tabArray = selected.type === 10 ? semestersMap[currentSemesterID][selected.module].lectures :
        selected.type === 20 ? semestersMap[currentSemesterID][selected.module].tutorials :
          selected.type === 30 ? semestersMap[currentSemesterID][selected.module].exams :
            semestersMap[currentSemesterID][selected.module].others;

      setItems(tabArray)
      const index = tabArray.findIndex(a => a.id === selected.id);
      setTabValueB(index < 0 ? 0 : index)
      setCurrentModule(selected.module)
      setIsPeriod(selected.module === "Periods")
    }
  }, [selected, currentSemesterID]);

  useEffect(() => {
    console.log("visibleDate has changed", visibleDate, selected)
    setCurrentSemesterID(getSemesterIDFromDate(visibleDate))
  }, [visibleDate])

  // console.log("EditingDrawer", currentSemesterID, currentModule, isPeriod, selected, items, semestersMap)

  const handleTabChange = (event, newValue, currentModule) => {
    setTabValueA(newValue);
    setTabValueB(0);
    let appointment8;
    switch (newValue) {
      case 0:
        appointment8 = currentModule.lectures.find(a => true);
        break;
      case 1:
        appointment8 = currentModule.tutorials.find(a => true);
        break;
      case 2:
        appointment8 = currentModule.exams.find(a => true);
        break;
      case 3:
        appointment8 = currentModule.others.find(a => true);
        break;
    }
    if (appointment8) {
      updateEditingView(appointment8);
    }
  };

  const handleTabChange2 = (event, newValue) => {
    if (newValue === items.length) {
      setTitle("New Appointment");
    } else {
      const appointment7 = items[newValue]
      updateEditingView(appointment7);
    }
    setTabValueB(newValue);
  };


  const updateTabs = (appointment, semestersMap) => {
    if (isNull(appointment)) {
      setTabValueA(0)
      setTabValueB(0)
      setItems([])
    } else {
      console.log("updateTabs1", appointment, semestersMap)
      const semesterID = getSemesterIDFromDate(appointment.start);
      if (isUndefined(semestersMap[semesterID]) || isUndefined(semestersMap[semesterID][appointment.module])) {
        setTabIDsAndItems(0, [], appointment)
      } else {
        const currentModule = semestersMap[semesterID][appointment.module]
        switch (appointment.type) {
          case 10:
            setTabIDsAndItems(0, currentModule.lectures, appointment)
            break
          case 20:
            setTabIDsAndItems(1, currentModule.tutorials, appointment)
            break
          case 30:
            setTabIDsAndItems(2, currentModule.exams, appointment)
            break
          default:
            setTabIDsAndItems(3, currentModule.others, appointment)
        }
      }


      function setTabIDsAndItems(tabValue, typeAppointments, appointment) {
        console.log("updateTabs2", appointment, currentModule, typeAppointments)
        if (typeAppointments.length === 0) {
          typeAppointments.push(appointment);
        }
        setTabValueA(tabValue)
        const index = typeAppointments.findIndex(a => a.id === appointment.id);
        setTabValueB(index < 0 ? 0 : index)
        setItems(typeAppointments)
      }

    }
  }




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
    open={openDrawer}
    // disableEnforceFocus
    PaperProps={{
      component: 'form',
      onSubmit: processInput(isPeriod),
    }}
  >
    <DrawerHeader>
      {(isNull(selected) || selected.module !== "Periods") && <Tooltip title="Add / Copy">
        <IconButton color="inherit" type="submit" name="new">
          <AddIcon fontSize='large' />
        </IconButton>
      </Tooltip>}

      {editMode && <div>
        <Tooltip title="Save Changes">
          <IconButton color="inherit" type="submit" name="save">
            <SaveIcon fontSize='large' />
          </IconButton>
        </Tooltip>
        {merge && <Tooltip title="Merge Modules">
          <IconButton color="inherit" type="submit" name="merge">
            <JoinRightIcon fontSize='large' />
          </IconButton>
        </Tooltip>}
        {!isEditing && selected && selected.module !== "Periods" &&
          <Tooltip title="Delete">
            <IconButton color="inherit" onClick={() => deleteObject(selected, currentModule)}>
              <DeleteIcon fontSize='large' />
            </IconButton>
          </Tooltip>}
      </div>}

    </DrawerHeader>
    {/* <Divider sx={{ mt: (marginTop - 0.5) }} /> */}
    <br></br>

    {!isPeriod && <div>


      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{ color: 'white', backgroundColor: 'grey' }}
        >
          Other modules
        </AccordionSummary>
        <AccordionDetails>
          <Autocomplete
            id="merge-module-title-in-drawer"
            options={getModules(semestersMap[currentSemesterID]).filter(m => m.title !== "Periods").sort().reduce((p, v) => [...p, v], ["Don't merge"])}
            value={mergeModule}
            onChange={(event, newValue) => { setMergeModule(newValue); setMerge(newValue !== "Don't merge") }}
            sx={{ mt: marginTop }}
            fullWidth
            getOptionLabel={(option) => option}
            freeSolo
            autoSelect
            renderInput={(params) => (
              <TextField {...params} label="Merge Module Title" name="mergemoduletitle" />
            )} />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
          sx={{ color: 'white', backgroundColor: 'grey' }}
        >
          Module data
        </AccordionSummary>
        <AccordionDetails>
          <Autocomplete
            id="module-title-in-drawer"
            options={getModules(semestersMap[currentSemesterID]).filter(m => m.title !== "Periods").sort()}
            value={currentModule}
            onChange={(event, newValue) => { setIsEditing(true); setCurrentModule(newValue) }} // Todo: Reconsider the whole module logic.
            sx={{ mt: marginTop }}
            fullWidth
            getOptionLabel={(option) => option}
            freeSolo
            autoSelect
            renderInput={(params) => (
              <TextField {...params} label="Module Title" name="moduletitle" />
            )} />
          Todo: More fields to be implemented.
        </AccordionDetails>
      </Accordion>
    </div>}

    <Accordion
      defaultExpanded
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel3-content"
        id="panel3-header"
        sx={{ color: 'white', backgroundColor: 'grey' }}
      >
        {isPeriod ? "Periods of " + getSemesterStringFromAppointment(selected) : "Module appointments"}
      </AccordionSummary>

      <AccordionDetails>
        {!isPeriod &&
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValueA} onChange={(event, newValue) => handleTabChange(event, newValue, semestersMap[currentSemesterID][selected.module])} aria-label="basic tabs example" variant="scrollable" scrollButtons="auto">
              <Tab label="Lectures" {...a11yProps(0)} />
              <Tab label="Tutorials" {...a11yProps(1)} />
              <Tab label="Exams" {...a11yProps(2)} />
              <Tab label="Other" {...a11yProps(3)} />
            </Tabs>
          </Box>
        }
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValueB} onChange={handleTabChange2} aria-label="basic tabs example2" variant="scrollable" scrollButtons="auto">
            {items.map((item, index) => (
              <Tab key={index} label={(selected ? mapType(selected.type) : "") + " " + (index + 1)} {...a11yProps2(index)} />
            ))}
            <Tab icon={<AddIcon />} {...a11yProps2(items.length)} />
          </Tabs>
        </Box>

        <AppointmentFields
          selected={selected}
          lecturers={lecturers}
          rooms={rooms}
          developerMode={developerMode}
        />
      </AccordionDetails>
    </Accordion>

  </Drawer>


  function processInput(isPeriod) {
    return (event) => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget)
      const formJson = Object.fromEntries(formData.entries())
      const module2 = formJson.appointmentmodule
      const title8 = formJson.title
      const date = formJson.datePicker
      const startTime11 = moment((date + " " + formJson.starttime11), "DD.MM.YYYY HH:mm").toDate();
      // setScrollToTime(new Date(date0).setHours(date0.getHours() - 1));
      const endTime11 = moment((date + " " + formJson.endtime11), "DD.MM.YYYY HH:mm").toDate();
      const periodEnd = moment((formJson.datePickerEnd), "DD.MM.YYYY").toDate();
      const rhythm3 = parseInt(formJson.rhythmSelect)
      const seriesStart = moment(formJson.startDate, "DD.MM.YYYY").toDate();
      const seriesEnd = moment(formJson.endDate, "DD.MM.YYYY").add(1, 'day').toDate();
      const type = parseInt(formJson.typeSelect)
      const lecturer2 = formJson.lecturer
      const room2 = formJson.room
      const participants2 = formJson.participants
      const draggable = formJson.draggableCheckbox === "on" ? true : false

      let secondUndo = false
      const semesterID = getSemesterIDFromDate(startTime11)
      console.log("processInput()")
      // console.log("processInput", rhythm3, date, date0, date1)

      // Add new module // This is done inside // Todo?: Move this into the change function?
      if (!isUndefined(module2) && module2 !== "" && !getModules(semestersMap[semesterID]).includes(module2)) {
        handleChange("addModule", buildModule(
          currentSemesterID, "LV-unknown", module2, "unknown",
          false, true, 2, "FB12", "unknown", 0,
          [], [], [], []
        ), secondUndo, semesterID, module2)
        secondUndo = true
      }

      // Add new lecturer
      if (!isUndefined(lecturer2) && lecturer2 !== "" && !lecturers.includes(lecturer2)) {
        handleChange("addLecturer", lecturer2, secondUndo, 0, "Lecturers")
        secondUndo = true
      }

      // Add new room
      if (!isUndefined(room2) && room2 !== "" && !rooms.includes(room2)) {
        handleChange("addRoom", room2, secondUndo, 0, "Rooms")
        secondUndo = true
      }

      let appointment4;

      if (isPeriod) {
        appointment4 = {
          module: "Periods",
          title: title8.toString(),
          type: 444,
          start: startTime11,
          end: periodEnd,
          allDay: true,
          isDraggable: draggable,
        }
      } else {
        appointment4 = {
          module: module2,
          title: title8.toString(),
          start: startTime11,
          end: endTime11,
          type: type,
          rhythm: rhythm3,
          seriesStart: seriesStart,
          seriesEnd: seriesEnd,
          allDay: isPeriod,
          isDraggable: draggable,
          lecturer: lecturer2,
          room: room2,
          participants: participants2,
        }
      }
      if (event.nativeEvent.submitter.name === "save") {
        handleChange("replace", appointment4, secondUndo, semesterID, appointment4.module)
      } else if (event.nativeEvent.submitter.name === "merge") {
        openAlertDialog("Merging '" + currentModule + "' into '" + mergeModule + "': Fields of '" + mergeModule + "' will be overwritten. Appointments will be combined.",
          "Cancel",
          "Merge",
          () => { console.warn("Todo: Merging to be implemented.") }
        )
      } else {
        handleChange("add", appointment4, secondUndo, semesterID, appointment4.module)
        updateTabs(appointment4, semestersMap);
      }
      setEditMode(true)
      setSelected(appointment4)
      setVisibleDate(appointment4.start)
    }
  }
}