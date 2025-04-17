//////////////////////////////////////////////////////////////
// Navigation

import { isUndefined } from 'lodash'

// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../../../src/addons/dragAndDrop/styles.scss'

import { getSemesterIDFromDate } from '../tools/functions'
import { noPeriodDefault } from '../settings/settings'


export const updatePeriodWithDate2 = (d, semestersMap, setVisibleDate, setPeriod, setEditMode, setSelected,
    filteredAppointments,
    processFilter22
) => {
    setVisibleDate(d);
    let currentPeriod = getCurrentPeriod(semestersMap[getSemesterIDFromDate(d)], d)
    processFilter22(d, currentPeriod, filteredAppointments)
    setPeriod(currentPeriod.id)
    setEditMode(false)
    setSelected(null)
}

export function getCurrentPeriod(currentSemester, d) {
    let currentPeriod
    if (isUndefined(currentSemester)) {
        currentPeriod = noPeriodDefault
    } else {
        currentPeriod = currentSemester["Periods"].others.find((p) => {
            const start = new Date(p.start)
            start.setDate(start.getDate() - 1)
            return (start <= d && d < p.end)
        })
        if (isUndefined(currentPeriod)) {
            currentPeriod = noPeriodDefault
        }
    }
    return currentPeriod
}

