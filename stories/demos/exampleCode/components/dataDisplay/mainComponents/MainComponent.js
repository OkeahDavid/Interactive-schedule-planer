import React, { useCallback, useMemo, useState, useRef } from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { isUndefined, isNull } from 'lodash'
import { Calendar, Views } from 'react-big-calendar'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';

import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';
import { Alert, Tooltip } from '@mui/material';


// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop'
import withDragAndDrop from '../../../../../../src/addons/dragAndDrop'
// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../../../../src/addons/dragAndDrop/styles.scss'

import { weekEndsPropGetter, getSemesterIDFromDate } from '../../tools/functions'
import { allViews, marginTop } from '../../settings/settings'
import { DropField } from '../../dataManagement/dataImport'
import { DateParser } from '../../tools/DateParser'
import { updatePeriodWithDate2 } from '../navigation'
import { getConflictTitle } from '../conflictAnalysis'
import { appointmentPropGetter2, getToolTipString2, Main, Appointment2 } from './componentsAppearance';
import { buildAppointment } from '../../dataManagement/dataImport';
import { SemesterPicker } from '../../userInteraction/components';
import { setInitialAppointments, getInitialAppointments } from './initialAppointments';


const DragAndDropCalendar = withDragAndDrop(Calendar)


export function MainComponent(
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
) {
    // console.log("MainComponent", dropFieldIsVisible, developerMode, semestersMap)

    const [year, setYear] = useState(moment())
    const [semester, setSemester] = useState('WiSe');

    const currentSemesterID = getSemesterIDFromDate(visibleDate) // Todo memorize


    const MainComponent2 = () => { // Necessary for functionality of backgroundappointmentbuttons

        const changeView = useCallback((view) => setCalendarView(view), [setCalendarView])

        const updatePeriodWithDate = useCallback(
            (d) => {
                updatePeriodWithDate2(d, semestersMap, setVisibleDate, setPeriod, setEditMode, setSelected,
                    getFilteredAppointments2(d),
                    processFilter22)
            }, [semestersMap]
        )
        // setUndoStack([])

        // const clickRef = useRef(null)

        // useEffect(() => {
        //   /**
        //    * What Is This?
        //    * This is to prevent a memory leak, in the off chance that you
        //    * teardown your interface prior to the timed method being called.
        //    */
        //   return () => {
        //     window.clearTimeout(clickRef?.current)
        //   }
        // }, [])

        // function buildMessage(slotInfo) {
        //   return `[onSelectSlot] a date selection was made, passing 'slotInfo'
        //   ${JSON.stringify(slotInfo, null, 2)}`
        // }

        const clickTimeout = useRef(null);

        // Store initial appointments on first load
        React.useEffect(() => {
            if (visibleAppointments && visibleAppointments.length > 0 && getInitialAppointments().length === 0) {
                setInitialAppointments(visibleAppointments);
            }
        }, [visibleAppointments]);

        const handleSelectAppointment = useCallback(
            (appointment) => {
                console.warn("Single click:", appointment);
                if (!appointment.isBackgroundAppointment) {
                    updateEditingView(appointment);
                    if (analyzeConflictsForOne) {
                        setVisibleAppointments(vis => addConflictFieldsForOne(appointment, vis))
                    }
                    // if (calendarView !== Views.MONTH) { // Todo: No conflict analysis for month view?
                    // }
                }
            },
            []
        )

        // Double click not used as it is triggering conflict analysis several times.
        // It was used to open the editing drawer.
        // const handleDoubleClickAppointment = useCallback(
        //     (appointment) => {
        //         console.log("Double clicked appointment:", appointment);
        //         if (!appointment.isBackgroundAppointment) {
        //             updateEditingView(appointment);
        //             setOpenSettingsDrawer(false)
        //             setOpenFilterDrawer(false)
        //             setDrawerOpen(true);
        //         }
        //     }, []
        // )

        const handleSelectSlot = useCallback(
            (event) => {
                if (event.action === 'click') {
                    // Ignore single clicks
                    return;
                }
                console.warn("handleSelectSlot")
                const titleSlot = window.prompt('New Appointment Title', "New Appointment"); // Using this the grey area remains and the appointment is not created immediately
                let rhythm = 0
                let seriesStart = event.start
                let seriesEnd = event.end
                const semesterID = getSemesterIDFromDate(event.start)
                const currentSemester = semestersMap[semesterID]
                if (!isUndefined(currentSemester)) {
                    const currentPeriod = currentSemester["Periods"].others.find((p) => (p.start <= event.start && event.start < p.end))
                    if (!isUndefined(currentPeriod) && (currentPeriod.title.includes("Lecture") || currentPeriod.title.includes("Condensed"))) {
                        rhythm = 7
                        const lecturePeriod = currentSemester["Periods"].others.find(p => p.id === -2)
                        seriesStart = lecturePeriod.start
                        seriesEnd = lecturePeriod.end // Todo: correct or -1 day ?
                    }
                }
                const newAppointment = buildAppointment(undefined, titleSlot, event.start, event.end, 10, rhythm, seriesStart, seriesEnd)

                handleChange("add", newAppointment, false, semesterID, newAppointment.module);

                // This was to focus on the title field to prompt for a new name and to avoid using window.prompt()
                // setEditMode(true);
                // setDrawerOpen(true); // This call seems to re-render the calendar, which we may not want.
                // setTimeout(() => {
                //   if (textFieldRef.current) {
                //     textFieldRef.current.focus();
                //   }
                // }, 0);
            }
            , [semestersMap]
        )

        const updateAppointment = useCallback((appointment, start, end) => {
            console.warn("updateAppointment, Step 1", appointment, start, end, selected)
            const newAppointment = { ...appointment, start, end }
            if (!isNull(selected) && selected.id === newAppointment.id) {
                setSelected(newAppointment)
            }
            handleChange("replace", newAppointment, false, getSemesterIDFromDate(newAppointment.start), newAppointment.module)
        }, [selected])

        // Todo: Move appointment. It is lost when its seriesStart is before lecture period start. Todo: Check all editing. Todo Check all undo and redo. Todo: Update visibleAppointments on actions.
        const moveAppointment = useCallback(
            ({ event, start, end, allDay: droppedOnAllDaySlot = false }) => {
                const { allDay } = event
                if (!allDay && droppedOnAllDaySlot) { // Todo: Is this correct?
                    event.allDay = true
                }
                updateAppointment(event, start, end)
            },
            []
        )

        const resizeAppointment = useCallback(
            ({ event, start, end }) => {
                updateAppointment(event, start, end)
            },
            []
        )



        // Customizing appointment content
        const Appointment = useCallback(({ event }) => {
            return Appointment2(setVisibleBackgroundAppointments, event, updateAppointment,
                setBackgroundAppointments, selected, openAlertDialog);
        }, [selected])


        Appointment.propTypes = {
            event: PropTypes.object,
        }


        const appointmentPropertiesGetter = useCallback(
            (appointment, start, end, isSelected) => {
                return appointmentPropGetter2(semestersMap, appointment, currentSemesterID, selected, analyzeAllConflicts, moduleWithSameStudyplanSemesterModulesMap,
                    showRoomConflicts, showTutorialConflicts, showPreviousYearConflicts,
                    showNextYearConflicts, showSameSemesterConflicts, showLecturerConflicts,
                    showTutorialLectureConflicts, analyzeConflictsForOne)
            }, [selected, analyzeAllConflicts]
        )


        const getToolTipString = useCallback((appointment) => (
            getToolTipString2(analyzeAllConflicts, selected, appointment)
        ), [analyzeAllConflicts])


        function AppointmentAgenda({ event }) {
            return (
                <span>
                    <em style={{ color: 'magenta' }}>{event.title}</em>
                    <p>{event.desc}</p>
                </span>
            )
        }
        AppointmentAgenda.propTypes = {
            event: PropTypes.object,
        }



        const { components } = useMemo(
            () => ({
                components: {
                    agenda: {
                        event: AppointmentAgenda,
                    },
                    event: Appointment,
                    // dateCellWrapper: MyDateCellWrapper,
                    // timeSlotWrapper: CustomTimeSlotWrapper,
                },
            }),
            []
        )



        return (
            <Main open={openDrawer || openSettingsDrawer || openFilterDrawer}>

                <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}> <br></br><br></br><br></br><br></br>
                        {developerMode && <DateParser />}
                        {developerMode && <Button sx={{ ml: 1 }} variant="contained" onClick={() => { importSampleData(year, semester) }}>Import Sample Data</Button>}
                        {developerMode &&
                            <Tooltip title="Import to condensed week">
                                <Checkbox
                                    // defaultChecked
                                    // inputProps={{ 'aria-label': 'controlled' }}
                                    checked={importToCondensedWeek}
                                    onChange={(event) => { setImportToCondensedWeek(event.target.checked) }}
                                />
                            </Tooltip>
                        }
                        {developerMode &&
                            SemesterPicker(year, setYear, semester, setSemester)
                        }
                        {showAlert && (
                            <div>
                                <br></br>
                                <Alert color={alertSeverity} severity={alertSeverity} onClose={() => setShowAlert(false)}>
                                    {alertMessage}
                                </Alert>
                            </div>
                        )}
                        <div style={{ marginLeft: 'auto', marginRight: '10px', height: 110 }}>
                            <br></br>
                            {backgroundAppointments.length > 0 && <Box sx={{ width: 300, ml: 2, mt: marginTop * 1.5 }}>
                                <Typography id="non-linear-slider" gutterBottom>
                                    Free slot conflict severity
                                </Typography>
                                <Slider
                                    // aria-label="Temperature"
                                    // defaultValue={30}
                                    getAriaValueText={getConflictTitle}
                                    valueLabelFormat={getConflictTitle}
                                    valueLabelDisplay="auto"
                                    // shiftStep={1}
                                    step={1}
                                    marks
                                    min={0}
                                    max={6}
                                    aria-labelledby="non-linear-slider"
                                    value={freeSlotConflictSeverity}
                                    onChange={handleSeverityChange}
                                />
                            </Box>}
                        </div>
                    </div>
                </div>
                {/* <div> <br></br></div> */}
                <div>
                    {(dropFieldIsVisible || developerMode) && <div>
                        {DropField(setWelcomeDialogOpen, handleOpenGroupingDialog, developerMode,
                            setDropFieldIsVisible, handleChange, semestersMap, showAlertMessage)}
                        <br></br>
                    </div>}
                </div>


                <div className="height600">
                    <DragAndDropCalendar
                        components={components}
                        date={visibleDate}
                        onNavigate={updatePeriodWithDate}
                        scrollToTime={scrollToTime}
                        // onScrollChange={(s) => setScrollToTime(s)}, does not work.
                        views={allViews}
                        defaultView={Views.WEEK}
                        view={calendarView}
                        onView={changeView}
                        draggableAccessor="isDraggable"
                        eventPropGetter={appointmentPropertiesGetter}
                        events={visibleAppointments}
                        tooltipAccessor={getToolTipString}
                        backgroundEvents={visibleBackgroundAppointments}
                        localizer={localizer}
                        onEventDrop={moveAppointment}
                        onEventResize={resizeAppointment}
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={handleSelectAppointment}
                        // onDoubleClickEvent={handleDoubleClickAppointment}
                        resizable
                        selectable
                        selected={selected}
                        popup
                        // rtl={true}
                        step={granularity}
                        timeslots={timeslots}
                        min={dayStart}
                        max={dayEnd}
                        showMultiDayTimes
                        style={{ height: '700px' }}
                        dayPropGetter={weekEndsPropGetter}
                    // slotPropGetter={weekEndsPropGetter}
                    />
                </div>
            </Main>
        )
    }
    return (<MainComponent2 />)
}