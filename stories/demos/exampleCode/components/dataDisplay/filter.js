//////////////////////////////////////////////////////////////
// Filter

import { isUndefined } from 'lodash'

// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../../../src/addons/dragAndDrop/styles.scss'

import { mapRhythm } from '../tools/functions'
import { noPeriodDefault } from './../settings/settings'



function newSeries(appointment5) {
    // console.log("newSeries with", appointment5)

    let date0 = new Date(appointment5.start)
    let date1 = new Date(appointment5.end)
    let rhythm3 = appointment5.rhythm
    // console.log("Search backwards")
    while (date0 > appointment5.seriesStart) {
        date0.setDate(date0.getDate() - rhythm3)
    }
    // console.log("Search forwards")
    while (date0 < appointment5.seriesStart) {
        date0.setDate(date0.getDate() + rhythm3)
    }
    // console.log("Create series appointments", maxSeriesId, appointment5)
    let newSeriesAppointments = []
    while (date0 <= appointment5.seriesEnd) {
        date1 = new Date(date0.getFullYear(), date0.getMonth(), date0.getDate(), date1.getHours(), date1.getMinutes())

        // if (date0.getDate() === 31  && date0.getMonth() === 4) {
        //   console.log("first day appointment", appointment5, date0, date0.getMonth(), date0.getDate(), date1, date1.getMonth(), date1.getDate())
        // }
        // if (date1.getMonth() !== date0.getMonth()) {
        //   console.warn("all day appointment", appointment5, date0,  date0.getMonth(), date0.getDate(), date1, date1.getMonth(), date1.getDate())
        // }

        newSeriesAppointments.push({ ...appointment5, start: new Date(date0), end: new Date(date1) })
        date0 = new Date(date0.getFullYear(), date0.getMonth(), date0.getDate() + rhythm3, date0.getHours(), date0.getMinutes())
    }
    // console.log("newSeriesAppointments", newSeriesAppointments)
    return newSeriesAppointments
}




export function getFilteredAppointments(currentSemester, semesterID, studyplans, filterPeriods, filterStudyplans, filterModules, filterTypes, filterRhythms, filterLecturers, filterRooms, filterParticipants, filterAppointments, filterDraggable) {
    const noExams = true //(3 <= date.getMonth() && date.getMonth() < 6) // <- Todo //|| (9 <= date.getMonth() && date.getMonth() < 12) || (0 <= date.getMonth() && date.getMonth() < 2) // Todo: Work with periods
    // console.log("getFilteredAppointments", semesterID, currentSemester, studyplans, filterPeriods, filterStudyplans, filterModules, filterTypes, filterRhythms, filterLecturers, filterRooms, filterParticipants, filterAppointments, filterDraggable)
    if (isUndefined(currentSemester)) {
        return []
    } else {

        // Filter according to studyplans
        let filterModulesTmp = []
        if (filterModules.length !== 0) {
            filterModulesTmp = filterModules
        } else {
            if (filterStudyplans.length !== 0) {
                for (const stp of filterStudyplans) {
                    // console.log(stp, studyplans[stp])
                    for (const [key, value] of studyplans[stp]) {
                        if (semesterID % 10 === 0) {
                            if (key % 2 === 0) {
                                for (const m of value) {
                                    if (!filterModulesTmp.includes(m)) {
                                        filterModulesTmp = [...filterModulesTmp, m]
                                    }
                                }
                            }
                        } else {
                            if (key % 2 !== 0) {
                                for (const m of value) {
                                    if (!filterModulesTmp.includes(m)) {
                                        filterModulesTmp = [...filterModulesTmp, m]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        // console.log("filterModulesTmp", filterModulesTmp)

        // Filter according to modules
        let moduleContents = []
        if (filterModulesTmp.length === 0) {
            moduleContents = Object.values(currentSemester)
        } else {
            moduleContents = Object.entries(currentSemester).filter(entry => {
                // console.log("moduleEntries", entry)
                return filterModulesTmp.includes(entry[0])
            }).map(entry => {
                console.log(entry[1])
                return entry[1]
            })
        }
        // console.log("moduleContents", moduleContents)


        // Filter according to types
        let appointmentsTmp = []
        if (filterTypes.length === 0) {
            appointmentsTmp = moduleContents.reduce((prev, curr) => {
                if (noExams) {
                    return [...prev, ...curr.lectures, ...curr.tutorials, ...curr.others]
                } else {
                    return [...prev, ...curr.lectures, ...curr.tutorials, ...curr.exams, ...curr.others]
                }
            }, [])
        } else {
            appointmentsTmp = moduleContents.reduce((prev, curr) => {
                // console.log(curr)
                let tmp = []
                let notAdded = true
                for (const t of filterTypes) {
                    console.log(t)
                    switch (t) {
                        case "Lecture":
                            tmp = [...tmp, ...curr.lectures]
                            break
                        case "Tutorial":
                            tmp = [...tmp, ...curr.tutorials]
                            break
                        case "Exam":
                            tmp = [...tmp, ...curr.exams]
                            break
                        default:
                            if (notAdded && !isUndefined(curr.others)) {
                                tmp = [...tmp, ...curr.others]
                                notAdded = false
                            }
                    }
                }
                console.log(tmp)
                return [...prev, ...tmp]
            }, [])
        }
        // console.log("appointmentsTmp", appointmentsTmp)
        // console.log("filterDraggable", filterDraggable)


        // Filter according to rhythms, lecturers, rooms, participants, appointments and draggability
        let filteredAppointments54 = appointmentsTmp.filter(a =>
            (filterRhythms.length === 0 || filterRhythms.includes(mapRhythm(a.rhythm))) // Todo: filter on numbers
            && (filterLecturers.length === 0 || filterLecturers.includes(a.lecturer))
            && (filterRooms.length === 0 || filterRooms.includes(a.room))
            && (filterParticipants.length === 0 || isUndefined(a.participants) || a.participants >= Math.min(...filterParticipants.map(pNo => parseInt(pNo.substring(2)))))
            && (filterAppointments.length === 0 || filterAppointments.includes(a.title))
            && (filterDraggable.length === 0 || (filterDraggable.includes("Draggable") && filterDraggable.includes("NonDraggable")) || (filterDraggable.includes("Draggable") && (isUndefined(a.isDraggable) || a.isDraggable)) || (filterDraggable.includes("NonDraggable") && (!isUndefined(a.isDraggable) && !a.isDraggable))))

        // console.log("filtered", filteredAppointments54)

        return filteredAppointments54
    }
}


// // To consider
// export function processFilter2ReplaceAll(setVisibleAppointments, semestersMap, freeSlotConflictSeverity, analyzeAllConflicts, selected, replacementArray) {
//     processFilter55(setVisibleAppointments, freeSlotConflictSeverity, analyzeAllConflicts,
//         selected, semestersMap, period, visibleDate,
//         replacementArray,
//         moduleWithSameStudyplanSemesterModulesMap, previousYearConflictMap, nextYearConflictMap,
//         setBackgroundAppointments, setVisibleBackgroundAppointments)
// }

// export function processFilter2WithNew(setVisibleAppointments, freeSlotConflictSeverity, analyzeAllConflicts, selected, semestersMap, newAppointmentArray, currentPeriodId) {
//     // console.log("processFilter2WithNew")
//     processFilter55(
//         setVisibleAppointments, freeSlotConflictSeverity, analyzeAllConflicts,
//         selected, semestersMap, currentPeriodId, visibleDate,
//         [...getFilteredAppointments(semestersMap, visibleDate, filterPeriods, filterStudyplans, filterModules, filterTypes, filterRhythms, filterLecturers, filterRooms, filterParticipants, filterAppointments, filterDraggable), ...newAppointmentArray],
//         moduleWithSameStudyplanSemesterModulesMap, previousYearConflictMap, nextYearConflictMap,
//         setBackgroundAppointments, setVisibleBackgroundAppointments)
// }

// export function processFilter2Delete(setVisibleAppointments, freeSlotConflictSeverity, analyzeAllConflicts, selected, semestersMap, toBeDeletedArray, currentPeriodId) {
//     // console.log("processFilter2Delete")
//     processFilter55(
//         setVisibleAppointments, freeSlotConflictSeverity, analyzeAllConflicts,
//         selected, semestersMap, currentPeriodId, visibleDate,
//         getFilteredAppointments(semestersMap, visibleDate, filterPeriods, filterStudyplans, filterModules, filterTypes, filterRhythms, filterLecturers, filterRooms, filterParticipants, filterAppointments, filterDraggable).filter(a => toBeDeletedArray.find(b => b.id === a.id) ? false : true),
//         moduleWithSameStudyplanSemesterModulesMap, previousYearConflictMap, nextYearConflictMap,
//         setBackgroundAppointments, setVisibleBackgroundAppointments)
// }

// export function processFilter2Replace(semestersMap, replacementArray, currentPeriodId, selected, analyzeAllConflicts, freeSlotConflictSeverity, setVisibleAppointments) {
//     // console.log("processFilter2Replace")
//     processFilter55(
//         setVisibleAppointments, freeSlotConflictSeverity, analyzeAllConflicts,
//         selected, semestersMap, currentPeriodId, visibleDate,
//         [...getFilteredAppointments(semestersMap, visibleDate, filterPeriods, filterStudyplans, filterModules, filterTypes, filterRhythms, filterLecturers, filterRooms, filterParticipants, filterAppointments, filterDraggable)
//             .filter(a => replacementArray.find(b => b.id === a.id) ? false : true),
//         ...replacementArray],
//         moduleWithSameStudyplanSemesterModulesMap, previousYearConflictMap, nextYearConflictMap,
//         setBackgroundAppointments, setVisibleBackgroundAppointments)
// }

// export function processFilter3WithReplacementPeriod(replacement, currentPeriod) {
//     // Todo
//     // setAppointments((prev) => {
//     //   const tmp = prev.map(p => p.id === replacement.id ? replacement : p)
//     //   processFilter8(tmp, currentPeriod, filterPeriods, filterStudyplans, filterModules, filterTypes, filterRhythms, filterLecturers, filterRooms, filterParticipants, filterAppointments, filterDraggable)
//     //   return tmp
//     // })
// }


// // Only called from other processFilter functions.
// const processFilter55 = (setVisibleAppointments, freeSlotConflictSeverity, analyzeAllConflicts,
//     selected, semestersMap, currentPeriod, currentDate,
//     filteredAppointments,
//     moduleWithSameStudyplanSemesterModulesMap, previousYearConflictMap, nextYearConflictMap,
//     setBackgroundAppointments, setVisibleBackgroundAppointments
// ) => {
//     let filteredAppointments54 = processFilter10(semestersMap, currentDate, currentPeriod, filteredAppointments)
//     // console.log("processFilter: selected", selected, freeSlotConflictSeverity, filteredAppointments54)
//     // console.log("with series", filteredAppointments54, filteredAppointments54.filter(a => !isUndefined(a.start) && a.start.getDate() === 1 && a.start.getMonth() === 5))

//     if (analyzeAllConflicts) {
//         setVisibleAppointments(addConflictFieldsForAll(filteredAppointments54,
//             moduleWithSameStudyplanSemesterModulesMap, previousYearConflictMap, nextYearConflictMap
//         ))
//     } else if (!isNull(selected)) {
//         setVisibleAppointments(addConflictFieldsForOne(filteredAppointments54, selected, freeSlotConflictSeverity,
//             moduleWithSameStudyplanSemesterModulesMap, previousYearConflictMap, nextYearConflictMap,
//             setBackgroundAppointments, setVisibleBackgroundAppointments
//         ))
//     } else {
//         setVisibleAppointments(filteredAppointments54)
//     }
// }

export function applyPeriod(currentSemester, currentPeriod, appointments) {
    // console.log("processFilter10 begin", currentSemester, currentPeriod, appointments)
    let foundPeriod
    if (typeof currentPeriod === 'number') {
        if (isUndefined(currentSemester)) {
            foundPeriod = noPeriodDefault
            // console.log("processFilter10: currentSemester not defined!")
        } else {
            foundPeriod = currentSemester["Periods"].others.find(p => p.id === currentPeriod)
            // if (isUndefined(foundPeriod)) {
            //   foundPeriod = noPeriodDefault
            // }
        }
    } else {
        foundPeriod = currentPeriod
    }
    let filteredAppointments54 = appointments
    // let filteredAppointments54 = appointments.filter(a => {
    //   return feature1.length === 0 // Todo: Period filtering and semester filtering
    //     // && (feature2.length === 0 || feature2.find(s => (studyplans[s].modules.map(m => m.title)).includes(a.module)))
    //     && (feature3.length === 0 || feature3.includes(a.module))
    //     && (feature4.length === 0 || feature4.includes(mapType(a.type))) // Todo: filter on numbers
    //     && (feature5.length === 0 || feature5.includes(mapRhythm(a.rhythm)))  // Todo: filter on numbers
    //     && (feature6.length === 0 || feature6.includes(a.lecturer))
    //     && (feature7.length === 0 || feature7.includes(a.room))
    //     && (feature8.length === 0 || isUndefined(a.participants) || a.participants >= Math.min(...feature8.map(pNo => parseInt(pNo.substring(2)))))
    //     && (feature9.length === 0 || feature9.includes(a.title))
    //     && (feature10.length === 0 || (feature10.includes("Draggable") && feature10.includes("NonDraggable")) || (feature10.includes("Draggable") && (isUndefined(a.isDraggable) || a.isDraggable)) || (feature10.includes("NonDraggable") && (!isUndefined(a.isDraggable) && !a.isDraggable)))
    // })
    // console.log("processFilter10 filteredAppointments54", currentPeriod, filteredAppointments54)
    if (foundPeriod.id === -2) { // Lecture Period

        // console.log("foundPeriod", foundPeriod)
        const currentCondensedWeek = currentSemester["Periods"].others.find(p => p.id === -1)
        // Todo: Transfer does not fully work yet with new appointments.
        const appointmentsFromCondensedWeek = filteredAppointments54
            .filter(a => currentCondensedWeek.start <= a.start && a.start <= currentCondensedWeek.end && !a.title.includes("Condensed"))
            .map(a => {
                let s = new Date(a.start)
                let e = new Date(a.end)
                s.setDate(s.getDate() + 28)
                e.setDate(e.getDate() + 28)
                return { ...a, start: s, end: e }
            })
        // console.log("condWeekUpdate", currentCondensedWeek, appointmentsFromCondensedWeek)
        // if (appointmentsFromCondensedWeek.length > 0) {
        //   handleChange("replaceMany", appointmentsFromCondensedWeek, false)
        // }
        const filteredAppointments = [
            ...filteredAppointments54.filter(a => foundPeriod.start <= a.start && a.start <= foundPeriod.end),
            ...appointmentsFromCondensedWeek,
        ]

        // console.log("filteredAppointments", filteredAppointments)
        filteredAppointments54 = filteredAppointments.reduce((prev, curr) => {
            if (isUndefined(curr.rhythm) || curr.rhythm === 0) {
                return [...prev, curr]
            } else {
                return [...prev, ...newSeries(curr)]
            }
        }, [])
        // console.log("with series", filteredAppointments54, filteredAppointments54.filter(a => !isUndefined(a.start) && a.start.getDate() === 1 && a.start.getMonth() === 5))
    } else if (foundPeriod.id === -1) { // Condensed Week
        // setCalendarView(Views.WEEK)
        const month = foundPeriod.start.getMonth()
        const year = foundPeriod.start.getFullYear()
        const periodToBeCondensed = currentSemester["Periods"].others.find(p => p.id === -2)
        // console.log("periodToBeCondensed", periodToBeCondensed)
        const filteredAppointments = filteredAppointments54.filter(a => periodToBeCondensed.start <= a.start && a.start <= periodToBeCondensed.end && a.module !== "Periods")

        const mappedAppointments = filteredAppointments.map(a => {
            let date = new Date(foundPeriod.start)
            const difference = a.start.getDay() - date.getDay()
            date.setDate(date.getDate() + difference)
            date.setHours(a.start.getHours(), a.start.getMinutes())
            const starttime = new Date(date)
            date.setHours(a.end.getHours(), a.end.getMinutes())
            const endtime = new Date(date)
            let condensedAppointment = { ...a, start: starttime, end: endtime }
            // console.log("mapping", a, condensedAppointment)
            return condensedAppointment
        })
        // console.log(filteredAppointments, mappedAppointments)
        filteredAppointments54 = [...mappedAppointments,
        // currentPeriod,
        ...filteredAppointments54.filter(a => (foundPeriod.start <= a.start && a.start <= foundPeriod.end))
        ]
    } else if (foundPeriod.id === 0) {
        // setRhythm(0)
    } else { // Exam periods
        // setRhythm(0)
        filteredAppointments54 = filteredAppointments54.filter(a => (foundPeriod.start <= a.start && a.start <= foundPeriod.end) || (a.module.includes("Lecture") && a.end < foundPeriod.start))
    }
    // console.log("processFilter10 end", filteredAppointments54)
    return filteredAppointments54
}
