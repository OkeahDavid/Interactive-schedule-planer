import { isUndefined, isNull } from 'lodash'
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import { Tooltip } from '@mui/material';

import { checkTimeOverlap } from '../conflictAnalysis'
import { drawerWidth } from '../../settings/settings';
import { mapType } from '../../tools/functions';




export function appointmentPropGetter2(semestersMap, appointment, currentSemesterID, selected,
    analyzeAllConflicts, moduleWithSameStudyplanSemesterModulesMap,
    showRoomConflicts, showTutorialConflicts, showPreviousYearConflicts,
    showNextYearConflicts, showSameSemesterConflicts, showLecturerConflicts,
    showTutorialLectureConflicts, analyzeConflictsForOne) {
    // console.log("appointmentPropGetter2", appointment, selected, semestersMap)
    //////
    // Periods should not change
    if (appointment.type === 444) {
        return { className: 'nonDraggable', }
    }
    // Todo?: It would be better not to make the borderColor white, but to make the borderStyle dotted
    let borderColor = appointment.isDraggable ? 'darkblue' : 'white'

    // Selected is yellow
    if (!isNull(selected) && appointment.id === selected.id) {
        return {
            style: {
                backgroundColor: 'yellow',
                borderColor: 'darkblue',
                borderStyle: appointment.isDraggable ? 'solid' : 'dotted',
                color: 'darkblue'
            }
        }
    }

    // Analyze all conflicts
    if (analyzeAllConflicts) {
        // Analyze tutorials
        if (appointment.type === 20) {
            if (showTutorialConflicts) {
                if (showLecturerConflicts && appointment.lecturerConflict) {
                    return {
                        className: 'strongConflict',
                        style: { borderColor }
                    }
                }
                if (showTutorialLectureConflicts && semestersMap[currentSemesterID][appointment.module]['lectures'].find(a => checkTimeOverlap(a, appointment))) {
                    // Lecture-tutorial-conflict
                    return {
                        className: 'tutorialStrongConflict',
                        style: { borderColor }
                    }
                }
                if (showSameSemesterConflicts && appointment.sameStudyplanSemester && appointment.sameStudyplanSemester.size > 0) {
                    return {
                        className: 'tutorialMediumConflict',
                        style: { borderColor }
                    }
                }
                if (showNextYearConflicts && appointment.nextYearConflicts && appointment.nextYearConflicts.size > 0) {
                    return {
                        className: 'tutorialWeakConflict',
                        style: { borderColor }
                    }
                }
                if (showPreviousYearConflicts && appointment.previousYearConflicts && appointment.previousYearConflicts.size > 0) {
                    return {
                        className: 'tutorialWeakConflict',
                        style: { borderColor }
                    }
                }
                if (showRoomConflicts && appointment.roomConflict) {
                    return {
                        className: 'orange',
                        style: { borderColor }
                    }
                }
            }
            if (showTutorialLectureConflicts && semestersMap[currentSemesterID][appointment.module]['lectures'].find(a => checkTimeOverlap(a, appointment))) {
                // Lecture-tutorial-conflict
                return {
                    className: 'tutorialStrongConflict',
                    style: { borderColor }
                }
            }
            return ({
                ...(appointment.isDraggable
                    ? {
                        className: 'isDraggable',
                    }
                    : {
                        className: 'nonDraggable',
                        style: {
                            borderColor: 'white',
                        }
                    }),
            })
        }

        // Analyze non-tutorials
        if (showLecturerConflicts && appointment.lecturerConflict) {
            return {
                className: 'strongConflict',
                style: { borderColor }
            }
        }
        if (showSameSemesterConflicts && appointment.sameStudyplanSemester && appointment.sameStudyplanSemester.size > 0) {
            return {
                className: 'mediumConflict',
                style: { borderColor }
            }
        }
        if (showNextYearConflicts && appointment.nextYearConflicts && appointment.nextYearConflicts.size > 0) {
            return {
                className: 'lightConflict',
                style: { borderColor }
            }
        }
        if (showPreviousYearConflicts && appointment.previousYearConflicts && appointment.previousYearConflicts.size > 0) {
            return {
                className: 'lightConflict',
                style: { borderColor }
            }
        }
        if (showRoomConflicts && appointment.roomConflict) {
            return {
                className: 'orange',
                style: { borderColor }
            }
        }
        return ({
            ...(appointment.isDraggable
                ? {
                    className: 'isDraggable',
                }
                : {
                    className: 'nonDraggable',
                    style: {
                        borderColor: 'white',
                    }
                }),
        })
    }

    // No conflict analysis
    if (!analyzeConflictsForOne || isNull(selected) || selected.type === 444) { // Todo: isNull(selected) may be removed (performance improvement)
        if (appointment.type === 10) {
            return {
                className: 'magenta',
                style: { borderColor }
            }
        }
        if (appointment.type === 20) {
            return {
                className: 'lightGreen',
                style: { borderColor }
            }
        }
        return ({
            ...(appointment.isDraggable
                ? {
                    className: 'isDraggable',
                }
                : {
                    className: 'nonDraggable',
                    style: {
                        borderColor: 'white',
                    }
                }),
            // ...(moment(start).hour() < 12 && {
            //   className: 'powderBlue',
            // }),
        })
    }

    // Single appointment conflict analysis

    borderColor = appointment.module === selected.module ? 'yellow' : borderColor
    const borderWidth = appointment.module === selected.module ? 2 : 1

    // Analyze tutorials
    if (appointment.type === 20) {
        if (showTutorialConflicts) {
            // console.log("Single appointment conflict analysis2T", borderColor, borderWidth)
            if (showLecturerConflicts && !isUndefined(appointment.lecturer) && appointment.lecturer === selected.lecturer) {
                // console.log("Single appointment conflict analysis2T1", borderColor, borderWidth)
                return {
                    className: checkTimeOverlap(appointment, selected) ? 'strongConflict' : 'green',
                    style: { borderColor, borderWidth }
                }
            }
            if (appointment.sameConflictGroup) {
                if (selected.module === appointment.module && selected.type === 10) {
                    // Lecture-tutorial-conflict
                    // console.log("Single appointment conflict analysis2T2", borderColor, borderWidth)
                    return {
                        className: checkTimeOverlap(appointment, selected) ? 'tutorialStrongConflict' : 'green',
                        style: { borderColor, borderWidth }
                    }
                }
                if (showSameSemesterConflicts && selected.module && (moduleWithSameStudyplanSemesterModulesMap[currentSemesterID % 10][selected.module].has(appointment.module) ? true : false)) {

                    // console.log("Single appointment conflict analysis2T3", borderColor, borderWidth)
                    return {
                        className: checkTimeOverlap(appointment, selected) ? 'tutorialMediumConflict' : 'green',
                        style: { borderColor, borderWidth }
                    }
                }
                if (showNextYearConflicts && appointment.nextYearConflicts && appointment.nextYearConflicts.size > 0) {
                    // console.log("Single appointment conflict analysis2T4", borderColor, borderWidth)
                    return {
                        className: checkTimeOverlap(appointment, selected) ? 'tutorialWeakConflict' : 'green',
                        style: { borderColor, borderWidth }
                    }
                }
                if (showPreviousYearConflicts && appointment.previousYearConflicts && appointment.previousYearConflicts.size > 0) {
                    // console.log("Single appointment conflict analysis2T5", borderColor, borderWidth)
                    return {
                        className: checkTimeOverlap(appointment, selected) ? 'tutorialWeakConflict' : 'green',
                        style: { borderColor, borderWidth }
                    }
                }
            }
            if (showRoomConflicts && !isUndefined(appointment.room) && appointment.room === selected.room) {
                // console.log("Single appointment conflict analysis2T6", borderColor, borderWidth)
                return {
                    className: checkTimeOverlap(appointment, selected) ? 'orange' : 'green',
                    style: { borderColor, borderWidth }
                }
            }
        }
        if (showTutorialLectureConflicts && appointment.sameConflictGroup && selected.module === appointment.module && selected.type === 10) {
            // Lecture-tutorial-conflict
            // console.log("Single appointment conflict analysis2T2", borderColor, borderWidth)
            return {
                className: checkTimeOverlap(appointment, selected) ? 'tutorialStrongConflict' : 'green',
                style: { borderColor, borderWidth }
            }
        }
        if (!appointment.sameConflictGroup) {
            // console.log("Single appointment conflict analysis2T7", borderColor, borderWidth)
            return {
                className: 'irrelevant',
                style: { borderColor, borderWidth }
            }
        }
        // console.log("Single appointment conflict analysis2T8", borderColor, borderWidth)
        return ({
            ...(appointment.isDraggable
                ? {
                    className: 'isDraggable',
                }
                : {
                    className: 'nonDraggable',
                    style: {
                        borderColor: 'white',
                        borderWidth
                    }
                }),
        })
    }


    // Analyze non-tutorials
    if (showLecturerConflicts && !isUndefined(appointment.lecturer) && appointment.lecturer === selected.lecturer) {
        // console.log("Single appointment conflict analysis3", borderColor, borderWidth)
        return {
            className: checkTimeOverlap(appointment, selected) ? 'strongConflict' : 'green',
            style: { borderColor, borderWidth }
        }
    }
    if (appointment.sameConflictGroup) {
        // console.log("Single appointment conflict analysis4", borderColor, borderWidth)
        if (showSameSemesterConflicts && selected.module && (moduleWithSameStudyplanSemesterModulesMap[currentSemesterID % 10][selected.module].has(appointment.module) ? true : false)) {

            // console.log("Single appointment conflict analysis4.1", borderColor, borderWidth)
            return {
                className: checkTimeOverlap(appointment, selected) ? 'mediumConflict' : 'green',
                style: { borderColor, borderWidth }
            }
        }
        if (showNextYearConflicts && appointment.nextYearConflicts && appointment.nextYearConflicts.size > 0) {
            // console.log("Single appointment conflict analysis4.2", borderColor, borderWidth)
            return {
                className: checkTimeOverlap(appointment, selected) ? 'lightConflict' : 'green',
                style: { borderColor, borderWidth }
            }
        }
        if (showPreviousYearConflicts && appointment.previousYearConflicts && appointment.previousYearConflicts.size > 0) {
            // console.log("Single appointment conflict analysis4.3", borderColor, borderWidth)
            return {
                className: checkTimeOverlap(appointment, selected) ? 'lightConflict' : 'green',
                style: { borderColor, borderWidth }
            }
        }
    }
    if (showRoomConflicts && !isUndefined(appointment.room) && appointment.room === selected.room) {
        // console.log("Single appointment conflict analysis5", borderColor, borderWidth)
        return {
            className: checkTimeOverlap(appointment, selected) ? 'orange' : 'green',
            style: { borderColor, borderWidth }
        }
    }
    if (!appointment.sameConflictGroup) {
        // console.log("Single appointment conflict analysis6", borderColor, borderWidth, appointment)
        return {
            className: 'irrelevant',
            style: { borderColor, borderWidth }
        }
    }
    // console.log("Single appointment conflict analysis7", borderColor, borderWidth)
    return ({
        ...(appointment.isDraggable
            ? {
                className: 'isDraggable',
            }
            : {
                className: 'nonDraggable',
                style: {
                    borderColor: 'white',
                    borderWidth
                }
            }),
    })

}




export function getToolTipString2(analyzeAllConflicts, selected, appointment) {
    return (analyzeAllConflicts || !isNull(selected))
        ? `\nTitle: ${appointment.title}${appointment.optional ? " (optional)" : ""}\nModule: ${appointment.module}\nType: ${mapType(appointment.type)}\nLecturer: ${appointment.lecturer}\nRoom: ${appointment.room}\n====================================\nConflicts: ${appointment.lecturerConflict
            ? "\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n• Lecturer:  " + appointment.lecturerConflict : ""}${appointment.roomConflict
                ? "\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n• Room:  " + appointment.roomConflict : ""}${!isUndefined(appointment.sameStudyplanSemester) && appointment.sameStudyplanSemester.size > 0
                    ? "\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n• Same semester modules:" + Array.from(appointment.sameStudyplanSemester).reduce((prev, curr) => {
                        prev = prev + "\n  - " + curr; return prev;
                    }, "") : ""}${(!isUndefined(appointment.previousYearConflicts) && appointment.previousYearConflicts.size > 0)
                        ? "\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n• Previous year modules:" + Array.from(appointment.previousYearConflicts).reduce((prev, curr) => {
                            prev = prev + "\n  - " + curr;
                            return prev;
                        }, "") : ""}${(!isUndefined(appointment.nextYearConflicts) && appointment.nextYearConflicts.size > 0)
                            ? "\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n• Next year modules:" + Array.from(appointment.nextYearConflicts).reduce((prev, curr) => {
                                prev = prev + "\n  - " + curr;
                                return prev;
                            }, "") : ""}${(
                                !isUndefined(appointment.tutorialConflicts) && appointment.tutorialConflicts.size > 0)
                                ? "\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n• Tutorials:" + Array.from(appointment.tutorialConflicts).reduce((prev, curr) => {
                                    prev = prev + "\n  - " + curr;
                                    return prev;
                                }, "") : ""}${!appointment.lecturerConflict
                                    && !appointment.roomConflict
                                    && (isUndefined(appointment.sameStudyplanSemester) || appointment.sameStudyplanSemester.size === 0)
                                    && (isUndefined(appointment.previousYearConflicts) || appointment.previousYearConflicts.size === 0)
                                    && (isUndefined(appointment.nextYearConflicts) || appointment.nextYearConflicts.size === 0) ? "none" : ""}`
        : `\nTitle: ${appointment.title}${appointment.optional ? " (optional)" : ""}\nModule: ${appointment.module}\nType: ${mapType(appointment.type)}\nLecturer: ${appointment.lecturer}\nRoom: ${appointment.room}`;
}


export const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: -drawerWidth * 3,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: -drawerWidth * 2,
        }),
        /**
         * This is necessary to enable the selection of content. In the DOM, the stacking order is determined
         * by the order of appearance. Following this rule, elements appearing later in the markup will overlay
         * those that appear earlier. Since the Drawer comes after the Main content, this adjustment ensures
         * proper interaction with the underlying content.
         */
        position: 'relative',
    }),
);


export function MyDateCellWrapper(props) {
    const { children, range, value, selectedDate } = props
    // console.log(props)
    const isSelected = new Date(value).valueOf() === new Date(selectedDate).valueOf();
    const isPastDay = new Date(value).valueOf() < new Date().valueOf();
    let dayBackgroundColor = 'yellow'
    const dayOfWeek = value.getDay();
    if (dayOfWeek === 6 || dayOfWeek === 0) {
        dayBackgroundColor = '#FFDDC1'; // Light orange
    }
    return React.cloneElement(Children.only(children), {
        style: developerMode ? {
            ...children.style,
            backgroundColor: dayBackgroundColor, // isSelected ? '#DEECF9' : isPastDay ? '#fbfcfd' : 'green', // Todo
            borderRight: '4px solid #e5e9f0',
            borderBottom: '4px solid #e5e9f0',
        } : { ...children.style },
    })
        ;
}

export const CustomTimeSlotWrapper = (props) => {
    const { children, value } = props
    // console.log("TimeSlotProps", props)

    const dayOfWeek = value.getDay();
    let backgroundColor = '#a4e1fd'; // Default color

    if (dayOfWeek === 6 || dayOfWeek === 0) {
        backgroundColor = '#FFDDC1'; // Light orange
    }

    // Assuming business hours are from 9 AM to 5 PM
    const startBusinessHour = 8;
    const endBusinessHour = 20;
    const slotHour = value.getHours();

    // Determine if the current time slot is within business hours
    const isBusinessHour = slotHour >= startBusinessHour && slotHour < endBusinessHour;

    // Apply custom styles based on whether the time slot is within business hours
    const style = {
        backgroundColor: isBusinessHour ? backgroundColor : '#90dfd2', // Lighter shade for non-business hours
        borderBottom: '1px solid #e5e9f0',
    };

    return React.cloneElement(Children.only(children), {
        style: developerMode ? {
            ...children.props.style,
            ...style,
        } : {
            ...children.props.style,
        },
    });
};


export function Appointment2(setVisibleBackgroundAppointments, appointment, updateAppointment,
    setBackgroundAppointments, selected, openAlertDialog) {
    // console.log("Appointment2", appointment, selected, selected2)
    const closeSlot = (event2) => {
        setVisibleBackgroundAppointments((prev) => prev.filter(b => b.id !== appointment.id));
        // setBackgroundAppointments((prev) => prev.filter(b => b.id !== appointment.id))
    };
    const moveAppointment = (slot, event, selected) => {
        console.log("moveAppointment", slot, selected, selected.isDraggable);
        if (isUndefined(selected.isDraggable) || selected.isDraggable) {
            updateAppointment(selected, slot.start, slot.end);
            setVisibleBackgroundAppointments((prev) => prev.filter(b => b.id !== slot.id)); // Todo: Or Clear?
            // setBackgroundAppointments((prev) => prev.filter(b => b.id !== appointment.id));

        } else {
            openAlertDialog("The appointment is marked as non-draggable. Are you sure you want to move it?", "Cancel", "Move",
                () => {
                    updateAppointment(selected, slot.start, slot.end);
                    setVisibleBackgroundAppointments((prev) => prev.filter(b => b.id !== slot.id)); // Todo: Or Clear?
                    // setBackgroundAppointments((prev) => prev.filter(b => b.id !== appointment.id));
                }
            );

        }
    };
    return (
        <div style={{ display: 'flex' }}>
            <span>
                {/* <div title={`${appointment.title}: ${appointment.description} something xrrc!, ${appointment.conflict}`}> */}
                <strong>{appointment.title}</strong>
                {!appointment.isBackgroundAppointment && ':  ' + mapType(appointment.type)}
                {appointment.isBackgroundAppointment &&
                    <div style={{ marginLeft: 'auto' }}>
                        <Tooltip title="Close">
                            <IconButton color="inherit"
                                onClick={closeSlot}
                            >
                                <CancelIcon
                                    onMouseDown={(event) => {
                                        event.stopPropagation();
                                    }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Move selected appointment here">
                            <IconButton color="inherit" onClick={(event) => moveAppointment(appointment, event, selected)}>
                                <MoveDownIcon
                                    onMouseDown={(event) => {
                                        event.stopPropagation();
                                    }} />
                            </IconButton>
                        </Tooltip>
                    </div>}
                {/* </div> */}
            </span>
        </div>
    );
}

