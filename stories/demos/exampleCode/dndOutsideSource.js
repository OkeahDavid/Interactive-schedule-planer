import React, { Fragment, useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Views, DateLocalizer } from 'react-big-calendar'
import moment from 'moment'
import Box from '@mui/material/Box';
import { isNull, isUndefined } from 'lodash'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import CssBaseline from '@mui/material/CssBaseline';
import { noPeriodDefault } from './components/settings/settings'

// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../src/addons/dragAndDrop/styles.scss'

import {
  names, studyplansInit, getSampleData,
  moduleWithSameStudyplanSemesterModulesMap as moduleWithSameStudyplanSemesterModulesMapInit,
  previousYearConflictMap as previousYearConflictMapInit, nextYearConflictMap as nextYearConflictMapInit
} from './components/dataManagement/mockData'

import { AlertDialog, WelcomeDialog } from './components/userInteraction/dialogs'
import { importModule } from './components/dataManagement/dataImport'
import { GroupingDataManagement } from './components/dataManagement/groupingDialogComponents/dataManagement'
import { EditingDrawer } from './components/dataManagement/EditingDrawer'
import { FilterDrawer } from './components/dataDisplay/FilterDrawer'
import { SettingsDrawer } from './components/settings/SettingsDrawer'
import { MainComponent } from './components/dataDisplay/mainComponents/MainComponent'
import { AppBarFunction } from './components/dataDisplay/AppBar2'
import { getFilteredAppointments, applyPeriod } from './components/dataDisplay/filter'
import { addConflictFieldsForAll, addConflictFieldsForOne4, checkTimeOverlap } from './components/dataDisplay/conflictAnalysis';
import { change, checkIfSemesterAndModuleExist, logChanges } from './components/dataManagement/dataChange';
import { getCurrentPeriod } from './components/dataDisplay/navigation';
import { getSemesterIDFromDate } from './components/tools/functions';
import { downloadData } from './components/dataManagement/dataExport';


// //////////////////////////////////////////////////////////////
// Naming Conventions
// Appointments have start and end, and can be displayed in the calendar.
// Events are triggered by for example an user interaction like a mouse click.
// react-big-calendar does not make this distinction, but in this code we try to maintain it.



// General settings


DnDOutsideResource.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
}


export default function DnDOutsideResource({ localizer }) {


  /////////////////////////////////////////////////////////////////

  // Data

  const [semestersMap, setSemestersMap] = useState({ maxID: 1 })
  const [studyplans, setStudyplans] = useState(studyplansInit) // Todo: Implement CRUD for studyplans
  const [rooms, setRooms] = useState(['Hörsaal IV', 'Hörsaal V', "03A20", "03A21", "03A23"]);
  const [lecturers, setLecturers] = useState([...names]);
  const [lvMappings, setLVMappings] = useState({})

  const [importToCondensedWeek, setImportToCondensedWeek] = useState(true)


  //////////////////////////////////////////////////////////////
  // Conflict Analysis

  const [analyzeConflictsForOne, setAnalyzeConflictsForOne] = useState(false)
  const [analyzeAllConflicts, setAnalyzeAllConflicts] = useState(false)
  const [selectedHasBeenNull, setSelectedHasBeenNull] = useState(true)
  const [moduleWithSameStudyplanSemesterModulesMap, setModulesInSameSemesterMap] = useState(moduleWithSameStudyplanSemesterModulesMapInit)
  const [previousYearConflictMap, setPreviousYearConflictMap] = useState(previousYearConflictMapInit)
  const [nextYearConflictMap, setNextYearConflictMap] = useState(nextYearConflictMapInit)
  const [backgroundAppointments, setBackgroundAppointments] = useState([]);
  const [visibleBackgroundAppointments, setVisibleBackgroundAppointments] = useState([]);
  const [freeSlotConflictSeverity, setFreeSlotConflictSeverity] = useState(1);
  const handleSeverityChange = (event, newValue) => {
    setFreeSlotConflictSeverity(newValue);
  }
  // Conflict settings in sidebar
  // Conflict classes sorted according to severity
  const [showAllConflicts, setShowAllConflicts] = useState(true)
  const [showLecturerConflicts, setShowLecturerConflicts] = useState(true)
  // const [showSameModuleLectureConflicts, setShowSameModuleLectureConflicts] = useState(true) // Todo
  const [showSameSemesterConflicts, setShowSameSemesterConflicts] = useState(true)
  const [showPreviousYearConflicts, setShowPreviousYearConflicts] = useState(true)
  const [showNextYearConflicts, setShowNextYearConflicts] = useState(true)
  // const [showLectureTutorialConflicts, setLectureTutorialConflicts] = useState(true) // Todo
  const [showTutorialLectureConflicts, setShowTutorialLectureConflicts] = useState(true)
  const [showTutorialConflicts, setShowTutorialConflicts] = useState(true);
  const [showRoomConflicts, setShowRoomConflicts] = useState(true);

  useEffect(() => {
    console.log("analyzeConflictsForOne", analyzeConflictsForOne, "selectedHasBeenNull", selectedHasBeenNull)
    if (analyzeConflictsForOne) {
      if (isNull(selected)) {
        showAlertMessage("warning", "Select appointment to analyze conflicts.")
        setVisibleBackgroundAppointments([])
      } else {
        setAnalyzeAllConflicts(false)
        if (selectedHasBeenNull) {
          processFilter(semestersMap, visibleDate, selected, "analyzeConflictsForOne")
          setSelectedHasBeenNull(false)
        } else {
          setVisibleBackgroundAppointments(backgroundAppointments.filter(s => (s.conflictSeverity <= freeSlotConflictSeverity && !checkTimeOverlap(s, selected))))
        }
      }
    } else {
      if (isNull(selected)) {
        setSelectedHasBeenNull(true)
      }
      setVisibleBackgroundAppointments([])
      setShowAlert(false)
    }
  }, [freeSlotConflictSeverity, selected, analyzeConflictsForOne, analyzeAllConflicts, semestersMap, visibleDate])


  const findAllConflicts = useCallback(() => {
    setSelected(null);
    setAnalyzeAllConflicts(true);
    setAnalyzeConflictsForOne(false)
    setSelectedHasBeenNull(true)
    setBackgroundAppointments([]);
    setVisibleBackgroundAppointments([]);
    setVisibleAppointments(vis => {
      console.log("setVisibleAppointments input called twice") // Todo: This is called twice.
      return addConflictFieldsForAll(vis, moduleWithSameStudyplanSemesterModulesMap, previousYearConflictMap, nextYearConflictMap)
    })
  }, [moduleWithSameStudyplanSemesterModulesMap, previousYearConflictMap, nextYearConflictMap])


  const addConflictFieldsForOne = useCallback((theOne, filteredAppointments54) => {
    // console.log("addConflictsFieldForOne", freeSlotConflictSeverity, theOne, filteredAppointments54)
    if (theOne.type === 444) {
      return filteredAppointments54
    }
    let { slots, enhancedAppointments2 } = addConflictFieldsForOne4(theOne, filteredAppointments54, moduleWithSameStudyplanSemesterModulesMap, previousYearConflictMap, nextYearConflictMap);
    // console.log("setVisibleBackgroundAppointments", v, selected, freeSlotConflictSeverity)
    setBackgroundAppointments(slots)
    setVisibleBackgroundAppointments(slots.filter(s => {
      return ((s.conflictSeverity <= freeSlotConflictSeverity) && !checkTimeOverlap(s, theOne))
    }))

    return enhancedAppointments2
  }, [freeSlotConflictSeverity, moduleWithSameStudyplanSemesterModulesMap, previousYearConflictMap, nextYearConflictMap,
    setBackgroundAppointments, setVisibleBackgroundAppointments])



  // Visible appointments
  const [visibleAppointments, setVisibleAppointments] = useState([])
  const [inactiveAppointments, setInactiveAppointments] = useState({ semesters: [], periods: [], studyplans: [], modules: [], lecturers: [], rooms: [], appointments: [] });
  const [selected, setSelected] = useState(null)
  const [period, setPeriod] = useState(0);
  const [currentModule, setCurrentModule] = useState("No Module");

  // Undo & Redo
  const [undoStack, setUndoStack] = useState([/*{ type: "modules", secondUndo: false, data: ["No Module"] }, { type: "periods", secondUndo: false, data: [noPeriodDefault] }, { type: "studyplans", secondUndo: false, data: "todo" }, { type: "lecturers", secondUndo: false, data: "todo" }*/]);
  const [redoStack, setRedoStack] = useState([]);
  const [undoNumber, setUndoNumber] = useState(50);
  const [warnSwitch, setWarnSwitch] = useState(true);

  // Website settings
  const [calendarView, setCalendarView] = useState(Views.WEEK);
  const [visibleDate, setVisibleDate] = useState(new Date());
  const [scrollToTime, setScrollToTime] = useState(moment().set({ hours: 0, minutes: 30 }).toDate())
  const [granularity, setGranularity] = useState(15);
  const [timeslots, setTimeSlots] = useState(4);
  const [dayStart, setDayStart] = useState(new Date(1972, 0, 1, 7, 0, 0));
  const [dayEnd, setDayEnd] = useState(new Date(1972, 0, 1, 21, 0, 0));
  const [developerMode, setDeveloperMode] = useState(true);
  const [dropFieldIsVisible, setDropFieldIsVisible] = useState(false);

  // Alerts
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlertMessage = (severity, message) => {
    setAlertSeverity(severity)
    setAlertMessage(message)
    setShowAlert(true)
  }

  // Dialogs
  const [openAlert, setAlertOpen] = useState(false); // AlertDialog
  const [alertTitle, setAlertTitle] = useState("[Alert Title]")
  const [alertCancelText, setAlertCancelText] = useState("[Cancel]")
  const [alertActionText, setAlertActionText] = useState("[Action]")
  const [alertActionFunction, setAlertActionFunction] = useState(() => () => console.log("Please pass a function!"))
  const [openWelcomeDialog, setWelcomeDialogOpen] = useState(false); // WelcomeDialog
  const [openGroupingDialog, setOpenGroupingDialog] = useState(false);

  function openAlertDialog(titleText, cancelText, actionText, actionFunction) {
    setAlertTitle(titleText)
    setAlertCancelText(cancelText)
    setAlertActionText(actionText)
    setAlertActionFunction(() => actionFunction)
    setAlertOpen(true);
  }

  // Sidebars
  const [openDrawer, setDrawerOpen] = useState(false);
  const [openSettingsDrawer, setOpenSettingsDrawer] = useState(false);
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const updateEditingView = useCallback((appointment) => {
    setShowAlert(false)
    setSelected(appointment) // Todo: Keep the blue border
    setCurrentModule(appointment.module);
    setVisibleDate(appointment.start);
    setEditMode(true);
    // // if (!appointment.allDay) {
    //   // Todo: first get current time and check if appointment is visible
    //   setScrollToTime(new Date(new Date(appointment.start).setHours(appointment.start.getHours() - 1)));
    // }
    console.log(analyzeAllConflicts, analyzeConflictsForOne, !isNull(selected))
    if (analyzeConflictsForOne) {
      setAnalyzeAllConflicts(false)
    }
  }, [analyzeAllConflicts, analyzeConflictsForOne, selected])


  //////////////////////////////////////////////////////////////
  // Filtering

  const [filterPeriods, setFeature1] = useState([]);
  const [filterStudyplans, setFeature2] = useState([]);
  const [filterModules, setFeature3] = useState([]);
  const [filterTypes, setFeature4] = useState([]);
  const [filterRhythms, setFeature5] = useState([]);
  const [filterLecturers, setFeature6] = useState([]);
  const [filterRooms, setFeature7] = useState([]);
  const [filterParticipants, setFeature8] = useState([]);
  const [filterAppointments, setFeature9] = useState([]);
  const [filterDraggable, setFilterDraggable] = useState([]);

  // const [openSelect1, setOpenSelect1] = useState(false);
  // const [openSelect2, setOpenSelect2] = useState(false);
  // const [openSelect3, setOpenSelect3] = useState(false);
  // const [openSelect4, setOpenSelect4] = useState(false);
  // const [openSelect5, setOpenSelect5] = useState(false);
  // const [openSelect6, setOpenSelect6] = useState(false);
  // const [openSelect7, setOpenSelect7] = useState(false);
  // const [openSelect8, setOpenSelect8] = useState(false);
  // const [openSelect9, setOpenSelect9] = useState(false);

  const processFilter = useCallback((semestersMap, date, modified, modificationType) => {
    if (modificationType === "deleteSemester") {
      processFilter23("deleteSemester", null, undefined, noPeriodDefault, [])
      return
    }
    if (modificationType === "addSemester") {
      setVisibleDate(date)
    }
    const semesterID = getSemesterIDFromDate(date);
    const currentSemester = semestersMap[semesterID]; // Todo: Maybe it was faster to pass down semestersMap and date?
    // console.log("processFilter", period, getCurrentPeriod(currentSemester, date), modified.start)
    processFilter23(modificationType, modified, currentSemester,
      getCurrentPeriod(currentSemester, date),
      getFilteredAppointments(currentSemester, semesterID, studyplans,
        filterPeriods, filterStudyplans, filterModules, filterTypes, filterRhythms,
        filterLecturers, filterRooms, filterParticipants, filterAppointments, filterDraggable)
    )

  }, [selected, freeSlotConflictSeverity, filterPeriods, filterStudyplans, filterModules, filterTypes, filterRhythms, filterLecturers,
    filterRooms, filterParticipants, filterAppointments, filterDraggable, analyzeConflictsForOne, analyzeAllConflicts])


  const processFilter22 = useCallback((currentDate, currentPeriod, appointments) => {
    processFilter23("unknown", selected, semestersMap[(getSemesterIDFromDate(currentDate))], currentPeriod, appointments)
  }, [semestersMap, processFilter23])


  const processFilter23 = useCallback((modificationType, modified, currentSemester, currentPeriod, filteredAppointments) => {
    console.log("processFilter23",
      modificationType
      // , selected, modified, currentSemester, currentPeriod, filteredAppointments
    )
    let filteredAppointments2 = applyPeriod(currentSemester, currentPeriod, filteredAppointments)

    if (analyzeConflictsForOne || modificationType === "analyzeConflictsForOne") {
      if (modificationType === "add") {
        console.log("added modified", modified, selected)
        setVisibleAppointments(addConflictFieldsForOne(modified, filteredAppointments2))
      } else if (!isNull(selected) && modificationType !== "deleteModule") {
        console.log("selected is not null", selected)
        if (selected.id === modified.id) {
          console.log("modified === selected", modified, selected)
          setVisibleAppointments(addConflictFieldsForOne(modified, filteredAppointments2))
        } else {
          console.log("modified different than selected", modified, selected)
          setVisibleAppointments(addConflictFieldsForOne(selected, filteredAppointments2))
        }
      }
    } else if (analyzeAllConflicts) {
      setVisibleAppointments(addConflictFieldsForAll(filteredAppointments2,
        moduleWithSameStudyplanSemesterModulesMap, previousYearConflictMap, nextYearConflictMap
      ))
    } else {
      console.log("No conflict analysis", filteredAppointments2)
      setVisibleAppointments(filteredAppointments2)
    }
    // console.log("Filtering done.")

  }, [selected, analyzeAllConflicts, freeSlotConflictSeverity, setVisibleAppointments,
    moduleWithSameStudyplanSemesterModulesMap, previousYearConflictMap, nextYearConflictMap,
    analyzeConflictsForOne])


  const getFilteredAppointments2 = useCallback((date) => {
    return getFilteredAppointments3(date, semestersMap)
  }, [semestersMap])

  const getFilteredAppointments3 = useCallback((date, semestersMap) => {
    const semesterID = getSemesterIDFromDate(date);
    return getFilteredAppointments(semestersMap[semesterID], semesterID, studyplans, filterPeriods, filterStudyplans, filterModules, filterTypes, filterRhythms, filterLecturers,
      filterRooms, filterParticipants, filterAppointments, filterDraggable)

  }, [semestersMap, filterPeriods, studyplans, filterStudyplans, filterModules, filterTypes, filterRhythms, filterLecturers,
    filterRooms, filterParticipants, filterAppointments, filterDraggable])


  const filterIsEmpty = useCallback(() => {
    return filterPeriods.length + filterStudyplans.length + filterModules.length + filterTypes.length + filterRhythms.length + filterLecturers.length + filterRooms.length + filterParticipants.length + filterAppointments.length + filterDraggable.length === 0;
  }, [filterPeriods, filterStudyplans, filterModules, filterTypes, filterRhythms, filterLecturers,
    filterRooms, filterParticipants, filterAppointments, filterDraggable])


  /////////////////////////////////////////////////////////////////
  // // Data management

  const [grouping, setGrouping] = useState('Objects');

  const handleOpenGroupingDialog = useCallback((grouping) => {
    console.warn("handleOpenGroupingDialog()", grouping, studyplans)
    setGrouping(grouping)
    setOpenGroupingDialog(true)
    setAnalyzeAllConflicts(false)
    setAnalyzeConflictsForOne(false)
  }, [visibleDate, semestersMap, studyplans])

  const importSampleData = useCallback((year, semester) => {
    const { currentDate78, semesterToBeImported } = getSampleData(year.year(), semester, importToCondensedWeek);
    setVisibleDate(currentDate78)
    for (const s of Object.keys(semesterToBeImported)) {
      for (const [m, v] of Object.entries(semesterToBeImported[s])) {
        if (isUndefined(v.title)) {
          console.warn("m undefined!", m)
        } else {
          if (m !== "Periods") {
            importModule(v, setLecturers, setRooms, handleChange);
          }
        }
      }
    }
    setSemestersMap(prev => {
      const filteredAppointments = getFilteredAppointments3(currentDate78, prev);
      // console.log("semestersMap, importedModules, filteredAppointments", semestersMap, prev, filteredAppointments, importToCondensedWeek)
      processFilter22(currentDate78, 0, filteredAppointments)
      // console.log("Modify semestersMap", maxId, semestersMap)
      return { ...prev, ...checkIfSemesterAndModuleExist(prev, 20020, "No Module") }
    })
    console.log("importSampleData done.")
  }, [semestersMap, setSemestersMap, importToCondensedWeek, setVisibleDate, processFilter22])


  const deleteObject = useCallback((toBeDeleted, moduleName) => {
    console.log("deleting", moduleName, toBeDeleted, semestersMap)

    setEditMode(false);
    setSelected(null)

    if (moduleName === "deleteModule") {
      handleChange("deleteModule", toBeDeleted.title, false, toBeDeleted.semesterID, toBeDeleted.title)
    } else if (moduleName === "deleteStudyplanModule") {
      console.warn("Todo: Delete studyplan module")
    } else {
      const semesterID = getSemesterIDFromDate(toBeDeleted.start)
      handleChange("deleteMany", [toBeDeleted], false, semesterID, moduleName)
      const m = semestersMap[semesterID][moduleName]
      // Module updates
      if (m.lectures.length + m.tutorials.length + m.exams.length + m.others.length === 0) {
        // Ask for deleting module ##
        openAlertDialog(("All appointments of the module '" + moduleName + "' have been deleted.\nDo you want to delete the module, too?"),
          "Keep",
          "Delete",
          () => {
            handleChange("deleteModule", moduleName, true, semesterID, moduleName)
            setCurrentModule(getModules(semestersMap[semesterID]).find(a => a !== moduleName))
          })
      }
    }
  }, [semestersMap])


  const handleChange = useCallback((type, modified, secondUndo, semesterID, module) => {

    change(type, modified, secondUndo, true, semesterID, module, processFilter, setSemestersMap,
      undoStack, setUndoStack, setRedoStack, warnSwitch, undoNumber, setStudyplans, setCurrentModule,
      visibleDate, setAnalyzeAllConflicts, setSelected, setLecturers, setRooms,
      setModulesInSameSemesterMap, setPreviousYearConflictMap, setNextYearConflictMap, updateEditingView, setVisibleAppointments
    )

    logChanges(type, modified, secondUndo, semesterID, module,
      visibleDate, selected, analyzeAllConflicts, analyzeConflictsForOne,
      freeSlotConflictSeverity, filterPeriods, filterStudyplans, filterModules, filterTypes, filterRhythms,
      filterLecturers, filterRooms, filterParticipants, filterAppointments, filterDraggable
    )

  }, [
    processFilter, setSemestersMap, undoStack, setUndoStack, setRedoStack, warnSwitch, undoNumber, studyplans,
    visibleDate, selected, analyzeAllConflicts, analyzeConflictsForOne,
    freeSlotConflictSeverity, filterPeriods, filterStudyplans, filterModules, filterTypes, filterRhythms,
    filterLecturers, filterRooms, filterParticipants, filterAppointments, filterDraggable
  ])


  // Data export
  const handleDownloadData = useCallback(() => {
    console.log("handleDownloadData", studyplans)
    downloadData(semestersMap, lvMappings, studyplans, lecturers, rooms)
  }, [semestersMap, lvMappings, studyplans, lecturers, rooms])


  //////////////////////////////////////////////////////////////
  // Website return function
  return (
    <Fragment>
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="de">

        <Box sx={{ display: 'flex' }}>
          <CssBaseline />

          {AppBarFunction(openDrawer, openSettingsDrawer, openFilterDrawer,
            semestersMap, handleDownloadData,
            undoStack, redoStack, currentModule, visibleDate, setVisibleDate, period,
            visibleAppointments, setDrawerOpen, setOpenSettingsDrawer, setOpenFilterDrawer, setSelected,
            setEditMode, analyzeAllConflicts,
            setWelcomeDialogOpen, setCurrentModule, setPeriod, setDropFieldIsVisible, dropFieldIsVisible,
            developerMode, setDeveloperMode, openAlertDialog,
            setAnalyzeAllConflicts, updateEditingView, handleOpenGroupingDialog,
            processFilter22, findAllConflicts, getFilteredAppointments2, filterIsEmpty, analyzeConflictsForOne, setAnalyzeConflictsForOne
          )}

          {MainComponent(
            openDrawer, selected, developerMode, openAlertDialog,
            setPeriod, setEditMode,
            setVisibleDate, addConflictFieldsForOne,
            freeSlotConflictSeverity, semestersMap, analyzeAllConflicts,
            openSettingsDrawer, openFilterDrawer, importToCondensedWeek,
            backgroundAppointments, dropFieldIsVisible,
            visibleDate, scrollToTime, calendarView, visibleAppointments, visibleBackgroundAppointments,
            localizer, granularity, timeslots, dayStart, dayEnd,
            setVisibleAppointments, analyzeConflictsForOne,
            updateEditingView, handleChange,
            moduleWithSameStudyplanSemesterModulesMap, setImportToCondensedWeek,
            setSelected, handleSeverityChange, setCalendarView,
            setBackgroundAppointments, setVisibleBackgroundAppointments,
            processFilter22, getFilteredAppointments2, importSampleData,
            setWelcomeDialogOpen, handleOpenGroupingDialog, setDropFieldIsVisible, showAlertMessage,
            showRoomConflicts, showTutorialConflicts, showPreviousYearConflicts,
            showNextYearConflicts, showSameSemesterConflicts, showLecturerConflicts,
            showTutorialLectureConflicts,
            showAlert, setShowAlert, alertSeverity, alertMessage
          )}

          {WelcomeDialog(openWelcomeDialog, setWelcomeDialogOpen, handleOpenGroupingDialog,
            setDropFieldIsVisible, handleChange, semestersMap, showAlertMessage, developerMode)}


          {GroupingDataManagement(
            grouping, openGroupingDialog, visibleDate, openAlertDialog, lecturers, rooms,
            semestersMap, setOpenGroupingDialog, updateEditingView, deleteObject,
            handleOpenGroupingDialog, setDrawerOpen, setOpenSettingsDrawer, setOpenFilterDrawer, setCurrentModule,
            showAlert, setShowAlert, alertSeverity, alertMessage, handleChange,
            setVisibleDate, setPeriod, setEditMode, setSelected, studyplans
          )}

          <AlertDialog
            open={openAlert}
            onClose={() => { setAlertOpen(false) }}
            onAction={alertActionFunction}
            titleText={alertTitle}
            cancelText={alertCancelText}
            actionText={alertActionText}
            sx={{ zIndex: 3410 }}
          />

          {EditingDrawer(
            openDrawer, selected,
            currentModule, rooms, developerMode, lecturers,
            setCurrentModule, editMode, setEditMode, handleChange,
            setSelected, openAlertDialog, deleteObject,
            semestersMap, visibleDate, setVisibleDate, updateEditingView
          )}

          {FilterDrawer(openFilterDrawer, filterPeriods, filterStudyplans, filterModules, filterTypes,
            filterRhythms, filterLecturers, filterRooms, filterParticipants, filterAppointments, filterDraggable,
            setFeature1, setFeature2, setFeature3, setFeature4, setFeature5, setFeature6, setFeature7,
            setFeature8, setFeature9, setFilterDraggable, visibleDate,
            studyplans, lecturers, rooms,
            semestersMap, period,
            processFilter22)}

          {SettingsDrawer(openSettingsDrawer, undoNumber, setUndoNumber, warnSwitch, setWarnSwitch,
            dayStart, setDayStart, dayEnd, setDayEnd, granularity, setGranularity, timeslots, setTimeSlots,
            showAllConflicts, setShowAllConflicts, showRoomConflicts, setShowRoomConflicts,
            showTutorialConflicts, setShowTutorialConflicts, showPreviousYearConflicts, setShowPreviousYearConflicts,
            showNextYearConflicts, setShowNextYearConflicts, showSameSemesterConflicts, setShowSameSemesterConflicts,
            showLecturerConflicts, setShowLecturerConflicts, showTutorialLectureConflicts, setShowTutorialLectureConflicts)}

        </Box>
      </LocalizationProvider>
    </Fragment>
  );


}


//////////////////////////////////////////////////////////////
// May be removed later

const formatName = (name, count) => `${name} ID ${count}`

