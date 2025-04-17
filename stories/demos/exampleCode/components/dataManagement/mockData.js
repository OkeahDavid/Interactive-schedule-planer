import { isUndefined } from 'lodash'
import { buildModule, importItems } from './dataImport'
import appointments from './../../../../resources/events'

// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../../../src/addons/dragAndDrop/styles.scss'

import { moveAppointmentDates } from '../tools/functions'



export const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Peterson',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];


export const studyplansInit = {
  'No Studyplan': new Map([
    [0, ["No Module"]],
    [1, ["No Module"]],
  ]),
  'BSc Informatics WiSe': new Map([
    [1, ["Objektorientierte Programmierung", "Technische Informatik", "Grundlagen der linearen Algebra"]],
    [2, ["Algorithmen und Datenstrukturen", "Programmierpraktikum", "Deklarative Programmierung", "Grundlagen der Analysis"]],
    [3, ["Theoretische Informatik", "Logik", "Softwaretechnik", "Grundlagen der Statistik"]],
    [4, ["Systemsoftware und Rechnerkommunikation", "Datenbanksysteme", "Software-Praktikum", "Praktikum zur Statistik", "Seminar"]],
    [5, ["Info Wahl 6LP", "Info Wahl 9LP", "Fortgeschrittenenpraktikum", "MarSkills", "MarSkills"]],
    [6, ["Info Wahl 9LP", "Bachelorarbeit", "MarSkills"]],
  ]),
  'BSc Informatics SoSe': new Map([
    [0, ["Systemsoftware und Rechnerkommunikation", "Deklarative Programmierung", "Grundlagen der Analysis"]],
    [1, ["Objektorientierte Programmierung", "Technische Informatik", "Grundlagen der linearen Algebra", "MarSkills"]],
    [2, ["Algorithmen und Datenstrukturen", "Datenbanksysteme", "Programmierpraktikum", "MarSkills"]],
    [3, ["Theoretische Informatik", "Logik", "Softwaretechnik", "Grundlagen der Statistik"]],
    [4, ["Info Wahl 9LP", "Info Wahl 9LP", "Software-Praktikum", "Praktikum zur Statistik", "Seminar"]],
    [5, ["Info Wahl 6LP", "Fortgeschrittenenpraktikum", "Bachelorarbeit", "MarSkills"]],
    [6, ["Samples Module", "IT-Security"]] // Todo, remove

  ]),
  // 'BSc Mathematics': { semesters: []], modules: [] },
  'BSc Business Informatics WiSe': new Map([
    [1, ["Objektorientierte Programmierung", "Entscheidung, Finanzierung und Investition", "BWL Wahl", "Grundlagen der linearen Algebra"]],
    [2, ["Algorithmen und Datenstrukturen", "Programmierpraktikum", "Grundlagen der Wirtschaftsinformatik", "Grundlagen der Analysis"]],
    [3, ["Operations Research", "Softwaretechnik", "WInfo Wahl", "BWL Wahl", "MarSkills"]],
    [4, ["Datenbanksysteme", "WInfo Wahl", "Software-Praktikum", "BWL Wahl"]],
    [5, ["Fortgeschrittenenpraktikum", "WInfo Wahl", "BWL Wahl", "Grundlagen der Statistik", "MarSkills"]],
    [6, ["BWL Wahl", "Seminar", "Praktikum zur Statistik", "Bachelorarbeit", "MarSkills"]]
  ]),
};

//// Conflict Analysis Functions (part)

export function getConflictingModules(currentSemesterID, module, studyplans) {
  const modulesInSameStudyplanSemester = Object.values(studyplans)
    .reduce((prev, curr) => {
      let newLocal = []
      for (const [key, value] of curr) {
        if ((key + currentSemesterID) % 2 === 0 && value.includes(module))
          newLocal = [...newLocal, ...value]
      }
      return [...prev, ...newLocal]
    }, [])
  return new Set(modulesInSameStudyplanSemester)
}


export function getModuleWithSameStudyplanSemesterModulesMap(studyplans) {
  const allModulesPerSemester = Object.values(studyplans).reduce((prev, curr) => {
    for (const entry of curr) {
      if (entry[0] % 2 === 0) {
        prev["S"] = [...prev["S"], ...entry[1]]
      } else {
        prev["W"] = [...prev["W"], ...entry[1]]
      }
    }
    return prev
  }, { "S": [], "W": [] })

  const summerSet = new Set(allModulesPerSemester.S)
  const winterSet = new Set(allModulesPerSemester.W)
  const allStudyplanModules = new Set([...summerSet, ...winterSet])
  const moduleWithSameStudyplanSemesterModulesMap = {}
  moduleWithSameStudyplanSemesterModulesMap[0] = {}  // SoSe
  moduleWithSameStudyplanSemesterModulesMap[1] = {}   // WiSe
  for (const m of allStudyplanModules) {
    moduleWithSameStudyplanSemesterModulesMap[0][m] = getConflictingModules(0, m, studyplans)
    moduleWithSameStudyplanSemesterModulesMap[1][m] = getConflictingModules(1, m, studyplans)
  }
  return { summerSet, winterSet, allStudyplanModules, moduleWithSameStudyplanSemesterModulesMap }
}


export const { summerSet, winterSet, allStudyplanModules, moduleWithSameStudyplanSemesterModulesMap } = getModuleWithSameStudyplanSemesterModulesMap(studyplansInit)


export const previousYearConflictMap = new Map()
export const nextYearConflictMap = new Map()
for (const module of allStudyplanModules) {
  previousYearConflictMap.set(module, new Set())
  nextYearConflictMap.set(module, new Set())
}
previousYearConflictMap.set("Periods", new Set())
nextYearConflictMap.set("Periods", new Set())
previousYearConflictMap.set("No Module", new Set())
nextYearConflictMap.set("No Module", new Set())

for (const plan of Object.values(studyplansInit)) {
  let initialKeyValue = -1
  for (const [key, moduleArray] of plan) {
    if (initialKeyValue < 0) {
      initialKeyValue = key
    }
    if (key - 2 >= initialKeyValue) {
      for (const module of moduleArray) {
        previousYearConflictMap.set(module, new Set([...previousYearConflictMap.get(module), ...plan.get(key - 2)]))
      }
    }
    if (key + 2 <= plan.size + initialKeyValue - 1) {
      for (const module of moduleArray) {
        nextYearConflictMap.set(module, new Set([...nextYearConflictMap.get(module), ...plan.get(key + 2)]))
      }
    }
  }
  initialKeyValue = -1
}


function generateMockModules(modulesArray, summerOrWinterModulesAlreadyPresent, counter, year, month, difference) {
  const mockModules = modulesArray.filter(v => !Object.keys(summerOrWinterModulesAlreadyPresent).includes(v)).map((v, i) => {
    counter = counter - 3
    return buildModule(year * 10 + (month === 3 ? 0 : 1), "LV-mock", v, "Basismodul",
      (i % 2 ? true : false), (i % 2 ? true : false), 2, "FB12",
      (i % 2 ? "Prof. Dr. Someone" : "Prof. Dr. Musterprof"), 100,
      [ // lectures
        {
          id: counter + 3,
          module: v,
          title: "Mock Lecture",
          start: new Date(year, month, 15 - difference, 8, 15),
          end: new Date(year, month, 15 - difference, 10, 45),
          rhythm: 7,
          seriesStart: new Date(year, month, 15 - difference, 8, 15),
          seriesEnd: new Date(year, month + 3, 15 - difference, 10, 45),
          lecturer: i % 2 ? "Prof. Dr. Someone" : "Prof. Dr. Musterprof",
          room: i % 2 ? "03A34" : i % 3 ? "04B40" : "05D20",
          allDay: false,
          isDraggable: true,
          type: 10,
          participants: -20 * (counter + 60001)
        }
      ],
      [ // tutorials
        {
          id: counter + 2,
          module: v,
          title: "Mock Tutorial",
          start: new Date(year, month, 16 - difference, 10, 15),
          end: new Date(year, month, 16 - difference, 12, 45),
          rhythm: 7,
          seriesStart: new Date(year, month, 16 - difference, 10, 15),
          seriesEnd: new Date(year, month + 3, 16 - difference, 12, 45),
          lecturer: i % 2 ? "Prof. Dr. Someone" : "Prof. Dr. Musterprof",
          room: i % 2 ? "03A34" : i % 3 ? "04B40" : "05D20",
          allDay: false,
          isDraggable: true,
          type: 20,
          participants: -20 * (counter + 60001)
        }
      ],
      [ // exams
        {
          id: counter + 1,
          module: v,
          title: "Mock Exam",
          start: new Date(year, month + 5, 16 - difference, 10, 15),
          end: new Date(year, month + 5, 16 - difference, 12, 45),
          rhythm: 0,
          lecturer: i % 2 ? "Prof. Dr. Someone" : "Prof. Dr. Musterprof",
          room: i % 2 ? "03A34" : i % 3 ? "04B40" : "05D20",
          allDay: false,
          isDraggable: true,
          type: 30,
          participants: -20 * (counter + 60001)
        }
      ],
      [], // others
    )
  })
  return { counter, mockModules }
}



export function getSampleData(year, semester, importToCondensedWeek) {
  console.log("getSampleData", year, semester)
  let counter = -60000; // Originally needed for id, but now needed for participants

  let month;
  let mockModules = [];
  let semesterID;
  const weekDay = new Date(year, 3, 15).getDay();
  let difference = (weekDay === 0 ? -1 : weekDay === 6 ? -2 : weekDay - 1) - 2;

  if (semester.startsWith("S")) {
    month = 3;
    semesterID = year * 10;
    ({ counter, mockModules } = generateMockModules(Array.from(summerSet), {}, counter, year, month, difference))
  } else {
    month = 9;
    semesterID = year * 10 + 1;
    difference = difference + 1;
    ({ counter, mockModules } = generateMockModules(Array.from(winterSet), {}, counter, year, month, difference))
  }

  let semesterToBeImported = {}

  // Import mock modules
  for (const m of mockModules) {
    semesterToBeImported = importItems(semesterToBeImported, semesterID, m.title, m.lectures, m.tutorials, m.exams, m.others, importToCondensedWeek)
    // counter = mockData.counter;
  }
  // console.log("importedModules1", importedModules)
  // Import adjustedAppointments
  const adjustedAppointments = appointments.map((e, index) => ({
    id: e.id,
    module: "Samples Module",
    title: e.title,
    type: 100,
    rhythm: 0,
    ...e,
    // isDraggable: index % 2 === 0,
  }));
  const mappedAppointments = moveAppointmentDates(adjustedAppointments, year, month, difference);
  // console.log("adj", typeof adjustedAppointments, adjustedAppointments, mappedAppointments)
  for (const a of mappedAppointments) {
    // console.log("a.module", typeof a, a, typeof adjustedAppointments, adjustedAppointments, mappedAppointments)
    if (!isUndefined(a)) { // Todo: How can it be, that a is undefined? There is a problem with periods somehow?
      semesterToBeImported = importItems(semesterToBeImported, semesterID,
        a.module ? a.module : "Samples Module",
        a.type === 10 ? [a] : [],
        a.type === 20 ? [a] : [],
        a.type === 30 ? [a] : [],
        a.type > 30 || isUndefined(a.type) ? [a] : [],
        importToCondensedWeek)
    } else {
      console.warn("error: a not defined", typeof a, a, typeof adjustedAppointments, adjustedAppointments, mappedAppointments);
    }
  }
  // console.log("importedModules2", importedModules)
  const currentDate78 = new Date(year, month, 15 - difference - (importToCondensedWeek ? 7 : 0));
  return { currentDate78, semesterToBeImported };
}

