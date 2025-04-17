import { isUndefined } from 'lodash'

import styles from './../../rendering.module.scss'
// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../../../src/addons/dragAndDrop/styles.scss'



import { getWeekDayYearDifference } from '../settings/settings'



export const weekEndsPropGetter = (date) => {
    if (date.getDay() === 0 || date.getDay() === 6)
        return {
            className: styles.specialDay2,
        }
    else return {}
}



export function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}


export function groupLecturers(appointments, lecturers) {
    return appointments.reduce((prev, curr) => {
        if (curr.type !== 444) { // Filter periods.
            if (prev[curr.lecturer]) {
                prev[curr.lecturer] = [...prev[curr.lecturer], curr]
            } else {
                prev[curr.lecturer] = [curr]
            }
        }
        return prev
    }, lecturers.reduce((prev, curr) => {
        prev[curr] = []
        return prev
    }, {}))
}

export function groupRooms(appointments, rooms) {
    return appointments.reduce((prev, curr) => {
        if (curr.type !== 444) { // Filter periods.
            if (prev[curr.room]) {
                prev[curr.room] = [...prev[curr.room], curr]
            } else {
                prev[curr.room] = [curr]
            }
        }
        return prev
    }, rooms.reduce((prev, curr) => {
        prev[curr] = []
        return prev
    }, {}))
}


export function moveAppointmentDates(appointmentsArrayOld, year, month, difference) {
    // console.log("moveAppointmentDates", year, month, difference)
    const tmp = appointmentsArrayOld.map(a => {
        const start = new Date(a.start)
        const end = new Date(a.end)

        start.setFullYear(year)
        end.setFullYear(year)
        start.setMonth(month) //  + a.start.getMonth()
        end.setMonth(month)
        start.setDate(start.getDate() - difference)
        end.setDate(end.getDate() - difference)
        // Todo: Reconsider seriesStart and seriesEnd
        if (a.rhythm !== 0) {
            return { ...a, start: new Date(start), end: new Date(end), seriesStart: new Date(year, month, 17), seriesEnd: new Date(year, month + 3, 18) }
        }
        return { ...a, start: new Date(start), end: new Date(end), seriesStart: new Date(start), seriesEnd: new Date(end) }
    })
    // console.log("tmp" , tmp)
    return tmp
}



export function moveAppointmentDatesForTesting(appointmentsArrayOld, year, month, difference) {
    // console.log("moveAppointmentDates", year, month, difference)
    const tmp = appointmentsArrayOld.map(a => {
        const start = new Date(a.start)
        const end = new Date(a.end)
        const oldMonth = a.start.getMonth()
        const newMonth = month + oldMonth - ((oldMonth > 2 && oldMonth < 9) ? 3 : 9)

        start.setFullYear(year)
        end.setFullYear(year)
        start.setMonth(newMonth)
        end.setMonth(newMonth)
        start.setDate(start.getDate() - difference)
        end.setDate(end.getDate() - difference)
        // Todo: Reconsider seriesStart and seriesEnd
        if (a.rhythm !== 0) {
            return { ...a, start: new Date(start), end: new Date(end), seriesStart: new Date(year, month, 17), seriesEnd: new Date(year, month + 3, 18) }
        }
        return { ...a, start: new Date(start), end: new Date(end), seriesStart: new Date(start), seriesEnd: new Date(end) }
    })
    // console.log("tmp" , tmp)
    return tmp
}



export function moveAppointmentsToCondensedWeek(appointmentsArrayOld, semesterID, importToCondensedWeek) {
    if (importToCondensedWeek) {
        const { year, month, difference } = getWeekDayYearDifference(semesterID)

        const tmp = appointmentsArrayOld.map(a => {

            const start = new Date(a.start)
            const end = new Date(a.end)
            const weekDay = a.start.getDay()

            start.setFullYear(year)
            end.setFullYear(year)
            start.setMonth(month)
            end.setMonth(month)
            start.setDate(7 - difference + weekDay)
            end.setDate(7 - difference + weekDay)
            // Todo: Reconsider seriesStart and seriesEnd
            return { ...a, start: new Date((start)), end: new Date((end)) }
        })
        return tmp
    } else {
        return appointmentsArrayOld
    }
}

// E.g. 20240 for SoSe2024 or 20241 for WiSe2024
export function getSemesterIDFromDate(date) {
    // If date is invalid, return a fallback (like 0).
    if (!date || isNaN(new Date(date).getTime())) {
        console.warn("getSemesterIDFromDate received invalid date:", date);
        return 0; // or some safe fallback
    }

    const validDate = new Date(date);
    const month = validDate.getMonth();
    const year = validDate.getFullYear();

    // Same logic as before, just more explicit:
    if (month < 3) {
        // Jan-Feb-Mar => "Winter" half, e.g. 20231
        return (year - 1) * 10 + 1;
    } else if (month < 9) {
        // Apr-Jul => year * 10 => "SoSe"
        return year * 10;
    } else {
        // Oct-Dec => year * 10 + 1 => "WiSe"
        return year * 10 + 1;
    }
}


export function getSemesterIDFromYearAndSemester(year, semester) {
    return semester.startsWith("S") ? year.year() * 10 : (year.year() * 10) + 1;
}

export function getSemesterIDfromString(semesterString) {
    if (!semesterString || semesterString.length < 4) {
        console.warn("getSemesterIDfromString invalid input:", semesterString);
        return 0; // or some fallback
    }

    // Example if you strictly expect "SoSe2024" or "WiSe2024":
    const prefix = semesterString.substring(0, 4); // e.g. "SoSe" or "WiSe"
    const yearPart = semesterString.substring(4);  // e.g. "2024"
    const parsedYear = parseInt(yearPart, 10);

    if (isNaN(parsedYear)) {
        console.warn("getSemesterIDfromString could not parse year:", semesterString);
        return 0;
    }

    if (prefix === "SoSe") {
        // SoSe => year * 10
        return parsedYear * 10;
    } else if (prefix === "WiSe") {
        // WiSe => year * 10 + 1
        return parsedYear * 10 + 1;
    } else {
        console.warn("Unrecognized prefix:", prefix);
        return 0;
    }
}


export function mapSemesterIDtoString(semesterID) {
    return semesterID % 10 === 0 ? ("SoSe" + semesterID / 10) : ("WiSe" + (semesterID - 1) / 10)
}

export function getSemesterStringFromAppointment(appointment) {
    // If there's a known .semester field, prefer it:
    if (appointment.semester) {
        return appointment.semester;
    }

    // If start is null or undefined, just return a fallback
    if (!appointment.start) {
        return "UnknownSemester";
    }

    // Now we know appointment.start is a real Date
    const d = new Date(appointment.start);
    if (isNaN(d.getTime())) {
        return "InvalidDate";
    }

    const month = d.getMonth();
    let year = d.getFullYear() - 2000;
    // If it's Jan/Feb/March, we treat it as the prior "Winter" half
    if (month < 3) {
        year -= 1;
    }
    const yearString = (year < 10 ? "0" : "") + year;

    return (month > 2 && month < 9)
        ? "SoSe" + yearString
        : "WiSe" + yearString;
}



export function mapType(type) {
    if (typeof type === 'number' || isUndefined(type)) {
        switch (type) {
            case 10:
                return "Lecture"
            case 20:
                return "Tutorial"
            case 30:
                return "Exam"
            case 40:
                return "Block"
            case 50:
                return "Seminar"
            case 60:
                return "Test"
            case 111:
                return "Module"
            case 444:
                return "Period"
            case 555:
                return "Slot"
            case 10000:
                return "No level"
            case 10001:
                return "Basismodul"
            case 10002:
                return "Aufbaumodul"
            case 10003:
                return "Vertiefungsmodul"
            default:
                return "Other"
        }
    } else {
        switch (type) {
            case "Lecture":
                return 10
            case "Tutorial":
                return 20
            case "Exam":
                return 30
            case "Block":
                return 40
            case "Seminar":
                return 50
            case "Test":
                return 60
            case "Period":
                return 444
            case "No level":
                return 10000
            case "Basismodul":
                return 10001
            case "Aufbaumodul":
                return 10002
            case "Vertiefungsmodul":
                return 10003
            default:
                return 100
        }
    }
}


export function mapRhythm(type) {
    if (typeof type === 'number' || isUndefined(type)) {
        switch (type) {
            case 0:
                return "Single"
            case 1:
                return "Daily"
            case 7:
                return "Weekly"
            case 14:
                return "Bi-Weekly"
            case 28:
                return "Monthly"
            case 9:
                return "Irregularly"
            default:
                return "Other"
        }
    } else {
        switch (type) {
            case "Single":
                return 0
            case "Daily":
                return 1
            case "Weekly":
                return 7
            case "Bi-Weekly":
                return 14
            case "Monthly":
                return 28
            case "Irregularly":
                return 9
            default:
                return 100
        }
    }
}

