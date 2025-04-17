import { isUndefined } from 'lodash'

// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../../../../src/addons/dragAndDrop/styles.scss'

import { groupLecturers, groupRooms, mapType, mapSemesterIDtoString } from '../../tools/functions'
import { getAllAppointments } from '../../dataDisplay/getData';


export function calculateRows(grouping, currentSemesterID, semestersMap, studyplans, lecturers, rooms) {
    console.log("calculateRows", semestersMap.maxID, grouping, currentSemesterID, semestersMap)
    let tmp = {}
    let rows = {
        "No Grouping": []
    }

    if (isUndefined(semestersMap[currentSemesterID]) && grouping === "Modules") {
        console.log("isUndefined(semestersMap[currentSemesterID])", rows)
        return rows
    }

    switch (grouping) {
        case "Semesters":
            rows = Object.entries(semestersMap)
                .filter(([k, v]) => k !== "maxID")
                .sort((a, b) => a[0].localeCompare(b[0]))
                .reduce((prev, [key, modules]) => {
                    const semesterString = key; // key is already "SoSe2024"

                    let counter = 0;
                    prev[semesterString] = Object.values(modules)
                        .filter(m => m.title !== "Periods")
                        .sort((a, b) => a.title.localeCompare(b.title))
                        .map(m => {
                            counter++;
                            return {
                                ...m,
                                id: counter,
                                type: 111,
                                semesterID: key
                            };
                        });
                    return prev;
                }, {});
            break;
        case "Periods":
            rows = Object.entries(semestersMap).filter(([k, v]) => (k !== "maxID")).sort((a, b) => a[0].localeCompare(b[0])).reduce((prev, [key, modules]) => {
                const semesterString = mapSemesterIDtoString(key)
                prev[semesterString] = [...modules["Periods"].others.filter(p => p.id !== 0)]
                return prev
            }, {})
            break
        case "Studyplans":
            let counter = 0
            rows = Object.entries(studyplans).sort((a, b) => a[0].localeCompare(b[0])).reduce((prev, [key, semesterModulesMap]) => {
                prev[key] = Array.from(semesterModulesMap).reduce((p, [k, v]) => {
                    return [...p, ...v.map(m => {
                        counter = counter + 1
                        return ({ id: counter, title: m, type: 111, rhythm: m.rhythm, semester: k })
                    })]
                }, []).sort()
                return prev
            }, {})
            break
        case "Modules":
            if (isUndefined(semestersMap[currentSemesterID])) {
                console.log("isUndefined(semestersMap[currentSemesterID])", rows)
                return rows
            }
            rows = Object.entries(semestersMap[currentSemesterID])
                .filter(([k, v]) => k !== "Periods")
                .sort((a, b) => a[0].localeCompare(b[0]))
                .reduce((prev, [moduleName, contents]) => {
                    prev[moduleName] = [
                        ...contents.lectures,
                        ...contents.tutorials,
                        ...contents.exams,
                        ...contents.others
                    ];
                    return prev;
                }, {});
            break;

        case "Lecturers":
            tmp = groupLecturers(getAllAppointments(semestersMap), lecturers)
            break
        case "Rooms":
            tmp = groupRooms(getAllAppointments(semestersMap), rooms)
            break
        case "Types":
            // Group by types
            tmp = (getAllAppointments(semestersMap)).reduce((prev, curr) => {
                if (curr.type !== 444) { // Periods are filtered.
                    if (prev[curr.type]) {
                        prev[curr.type] = [...prev[curr.type], curr]
                    } else {
                        prev[curr.type] = [curr]
                    }
                }
                return prev
            }, {
                10: [],
                20: [],
                30: [],
                40: [],
                50: [],
                60: [],
                100: [],
            })
            // Map type id
            tmp = Object.entries(tmp).reduce((prev, [key, value]) => {
                prev[mapType(parseInt(key))] = value
                return prev
            }, {})
            break
        default:
            console.error("Grouping not available #1", grouping)
    }
    // console.log("rows1", rows)

    // Add semester field
    switch (grouping) {
        case "Lecturers":
        case "Rooms":
        case "Types":
            rows = Object.fromEntries(Object.entries(tmp).sort((a, b) => a[0].localeCompare(b[0])))
    }
    // console.log("rows", rows)
    return rows
}