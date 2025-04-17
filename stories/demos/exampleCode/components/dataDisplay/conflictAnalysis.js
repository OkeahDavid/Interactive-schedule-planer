//////////////////////////////////////////////////////////////
// Conflict analysis
import { isUndefined } from 'lodash'

// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../../../src/addons/dragAndDrop/styles.scss'

import { getSemesterIDFromDate } from '../tools/functions'



export function checkTimeOverlap(appointment, selected) {
    return (appointment.start <= selected.start && selected.start < appointment.end) || (appointment.start < selected.end && selected.end <= appointment.end) || (selected.start < appointment.start && appointment.end < selected.end)
}

export function getConflictTitle(conflictSeverity) {
    switch (conflictSeverity) {
        case 0:
            return 'None'
        case 1:
            return 'Free'
        case 2:
            return 'Room conflict'
        case 3:
            return 'Tutorial conflict'
        case 4:
            return 'Other year conflict'
        case 5:
            return 'Same semester conflict'
        case 6:
            return 'Lecturer conflict'
        default:
            return 'Conflict title error'
    }
}



export function addConflictFieldsForAll(visibleAppointments,
    moduleWithSameStudyplanSemesterModulesMap, previousYearConflictMap, nextYearConflictMap
) {
    if (visibleAppointments.length === 0) {
        return visibleAppointments
    }
    const semesterID = getSemesterIDFromDate(visibleAppointments[0].start)
    console.log("addConflictFieldsForAll", semesterID, moduleWithSameStudyplanSemesterModulesMap)
    let enhancedAppointments2 = []
    for (const a of visibleAppointments) {
        let lecturerConflict = false
        let roomConflict = false
        let sameStudyplanSemester = new Set()
        const modulesMap = moduleWithSameStudyplanSemesterModulesMap[semesterID % 10][a.module]
        let previousYearConflicts = new Set()
        let nextYearConflicts = new Set()
        if (a.type !== 444) {
            for (const b of visibleAppointments) {
                if (b.type !== 444 && a.id !== b.id && checkTimeOverlap(a, b)) {
                    // if (b.title.includes("Studyplan") && a.title.startsWith("Room")) console.log(a, b, a.module, b.module, visibleAppointments, modulesMap, moduleWithSameStudyplanSemesterModulesMap)

                    // add lecturer conflict
                    if (!lecturerConflict && a.lecturer === b.lecturer) {
                        lecturerConflict = true
                    }
                    // add room conflict
                    if (!roomConflict && a.room === b.room) {
                        roomConflict = true
                    }
                    // same semester conflict
                    if (!isUndefined(modulesMap) && modulesMap.has(b.module)) {
                        sameStudyplanSemester.add(b.module)
                        // if (b.title.includes("Studyplan") && a.title.startsWith("Room")) console.log(sameStudyplanSemester)
                    }
                    // year conflicts
                    if (previousYearConflictMap.get(a.module).has(b.module)) {
                        previousYearConflicts.add(b.module)
                    }
                    if (nextYearConflictMap.get(a.module).has(b.module)) {
                        nextYearConflicts.add(b.module)
                    }
                }
            }
        }
        enhancedAppointments2.push({
            ...a,
            lecturerConflict: (lecturerConflict ? a.lecturer : false),
            roomConflict: (roomConflict ? a.room : false),
            sameStudyplanSemester,
            previousYearConflicts,
            nextYearConflicts
        })
    }

    // console.log("enhancedAppointments2FA", enhancedAppointments2)
    return enhancedAppointments2
}


export function addConflictFieldsForOne4(theOne, filteredAppointments54, moduleWithSameStudyplanSemesterModulesMap, previousYearConflictMap, nextYearConflictMap) {
    const conflictingModulesSet = moduleWithSameStudyplanSemesterModulesMap[getSemesterIDFromDate(theOne.start) % 10][theOne.module];
    let enhancedAppointments2 = [];
    const slotMatrix = Array.from({ length: 7 }, () => Array.from({ length: 8 }, () => [])
    );

    // Analyze conflicts for each other appointment
    for (const w of filteredAppointments54) {
        if (w.type === 444) {
            enhancedAppointments2.push(w);
        } else {
            let roomConflict = false;
            let tutorialConflicts = new Set();
            let previousYearConflicts = new Set();
            let nextYearConflicts = new Set();
            let sameStudyplanSemester = new Set();
            let lecturerConflict = false;

            if (theOne.id !== w.id) {
                // add lecturer conflict field
                if (w.lecturer === theOne.lecturer) {
                    lecturerConflict = true;
                }
                // same semester conflict field
                if (!isUndefined(conflictingModulesSet)) {
                    if (conflictingModulesSet.has(w.module)) {
                        sameStudyplanSemester.add(theOne.module);
                    }
                    // if (v.title.includes("Video") && w.title.startsWith("Dutch")) console.log(lecturerConflict, roomConflict, conflictingModulesSet.has(w.module), conflictingModules, v, w, v.module, w.module, conflictingModulesSet, moduleWithSameStudyplanSemesterModulesMap, visibleAppointments)
                }
                // year conflicts fields
                // console.log("B", w, theOne) // Todo: When adding new modules, same and next semester maps need to be updated.
                // console.log("addConflictFieldsForOne4", previousYearConflictMap, w.module, theOne.module)
                if (previousYearConflictMap.get(w.module).has(theOne.module)) {
                    previousYearConflicts.add(theOne.module);
                }
                if (nextYearConflictMap.get(w.module).has(theOne.module)) {
                    nextYearConflicts.add(theOne.module);
                }
                // add tutorial conflict
                if (theOne.type === 20 && (previousYearConflicts.size > 0 || nextYearConflicts.size > 0 || sameStudyplanSemester.size > 0)) {
                    tutorialConflicts.add(theOne.module);
                }
                // add room conflict field
                if (w.room === theOne.room) {
                    roomConflict = true;
                }
            }

            enhancedAppointments2.push({
                ...w,
                lecturerConflict: (lecturerConflict ? w.lecturer : false),
                roomConflict: (roomConflict ? w.room : false),
                sameStudyplanSemester,
                previousYearConflicts,
                nextYearConflicts,
                tutorialConflicts,
                sameConflictGroup: (roomConflict || tutorialConflicts.size > 0 || previousYearConflicts.size > 0 || nextYearConflicts.size > 0 || sameStudyplanSemester.size > 0 || lecturerConflict),
                // timeOverlap: checkTimeOverlap(w, v),
            });

            // Hours restriction because of the slotMatrix
            if (6 <= w.start.getHours() && w.start.getHours() < 22 && w.type !== 30) { // Todo: Exam exclusion not here
                const day = w.start.getDay();
                const startHour = Math.trunc((w.start.getHours() - 6) / 2);
                const endHour = w.end.getMinutes() > 0 ? Math.trunc((w.end.getHours() - 6) / 2) : Math.trunc((w.end.getHours() - 7) / 2);
                for (let i = 0; i <= endHour - startHour; i++) {
                    if (startHour + i < 8) {
                        slotMatrix[day][startHour + i].push(w);
                    }
                }
                // if (w.start.getDay() === 3) console.log("conflictSeverity", day, w.start.getHours(), startHour, conflictSeverity, w)
            }
        }
    }
    // console.log("slotMatrix", slotMatrix)
    // Free Slot analysis
    let slots = [];

    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 8; j++) {
            let conflictSeverity = 1;
            let lecturerConflict = false;
            let roomConflict = false;
            let tutorialConflicts = new Set();
            let previousYearConflicts = new Set();
            let nextYearConflicts = new Set();
            let sameStudyplanSemester = new Set();

            for (const w of (slotMatrix[i][j])) {
                if (w.id !== theOne.id) {
                    // add lecturer conflict
                    if (w.lecturer === theOne.lecturer) {
                        lecturerConflict = true;
                        conflictSeverity = 6;
                    }
                    // same semester conflict
                    if (!isUndefined(conflictingModulesSet)) {
                        if (conflictingModulesSet.has(w.module)) {
                            sameStudyplanSemester.add(w.module);
                            conflictSeverity = Math.max(5, conflictSeverity);
                        }
                        // if (v.title.includes("Video") && w.title.startsWith("Dutch")) console.log(lecturerConflict, roomConflict, conflictingModulesSet.has(w.module), conflictingModules, v, w, v.module, w.module, conflictingModulesSet, moduleWithSameStudyplanSemesterModulesMap, visibleAppointments)
                    }
                    // previous / next year conflicts
                    if (previousYearConflictMap.get(theOne.module).has(w.module)) {
                        previousYearConflicts.add(w.module);
                        conflictSeverity = Math.max(4, conflictSeverity);
                    }
                    if (nextYearConflictMap.get(theOne.module).has(w.module)) {
                        nextYearConflicts.add(w.module);
                        conflictSeverity = Math.max(4, conflictSeverity);
                    }
                    // add tutorial conflict
                    if (w.type === 20 && (previousYearConflicts.size > 0 || nextYearConflicts.size > 0 || sameStudyplanSemester.size > 0)) {
                        tutorialConflicts.add(w.module);
                        conflictSeverity = Math.max(3, conflictSeverity);
                    }
                    // add room conflict
                    if (w.room === theOne.room) {
                        roomConflict = true;
                        conflictSeverity = Math.max(2, conflictSeverity);
                    }
                }
            }
            // if (i === 3 && j === 1) console.log("i === 3 && j === 1", conflictSeverity, getConflictTitle(conflictSeverity)) // Todo: Why is it called two times?
            slots.push({
                id: -121212 - i * 10 - j,
                title: getConflictTitle(conflictSeverity),
                start: new Date(theOne.start.getFullYear(), theOne.start.getMonth(), theOne.start.getDate() - theOne.start.getDay() + i, 6 + 2 * j),
                end: new Date(theOne.start.getFullYear(), theOne.start.getMonth(), theOne.start.getDate() - theOne.start.getDay() + i, 8 + 2 * j),
                type: 555,
                isBackgroundAppointment: true,
                lecturerConflict: (lecturerConflict ? theOne.lecturer : false),
                roomConflict: (roomConflict ? theOne.room : false),
                sameStudyplanSemester,
                previousYearConflicts,
                nextYearConflicts,
                tutorialConflicts,
                conflictSeverity
            });
        }
    }
    return { slots, enhancedAppointments2 };
}

