import { isUndefined } from 'lodash'


export const getModules = (currentSemester) => {
    if (isUndefined(currentSemester)) {
        return [] // Todo: Or should it be ["No Module"]?
    } else {
        return Object.keys(currentSemester)
    }
}

export const getAppointmentsFromSemester = (currentSemester) => {
    console.log("getAppointmentsFromSemester", currentSemester)
    if (isUndefined(currentSemester)) {
        return []
    } else {
        return Object.values(currentSemester).reduce((prev, module) => {
            return [...prev, ...module.lectures, ...module.tutorials, ...module.exams, ...module.others]
        }, [])
    }
}

export const getAllAppointments = (semestersMap) => {
    console.log("getAllAppointments", semestersMap)
    if (isUndefined(semestersMap)) {
        return []
    } else {
        return Object.values(semestersMap).filter(s => (typeof s === 'object')).reduce((prev, semester) => {
            return [...prev, ...Object.values(semester).reduce((p, module) => {
                return [...p, ...module.lectures, ...module.tutorials, ...module.exams, ...module.others]
            }, [])]
        }, [])
    }
}