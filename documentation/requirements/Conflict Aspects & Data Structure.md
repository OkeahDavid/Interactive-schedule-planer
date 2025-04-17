# Conflict aspects
## General
- Modules within a semester can be in conflict. √
- Appointments within modules can be in conflict. √
- Modules of the same lecturer can be in conflict. √
- Lectures in the same room can be in conflict. √
- (Check for fixed modules / appointments. Not really necessary?)

## Mandatory Modules
- Studyplans conflicts √
  - Modules within a studyplan semester can be in conflict. √
  - Modules of different studyplans can be in conflict. √
  - Modules of the next year of a studyplan can be in conflict. √
  - Modules of the next year of different studyplans can be in conflict. √

## Optional Modules
- Optional modules can be in conflict. √

## Tutorials
- Tutorials can be in conflict. √
  - Room conflicts as above (semi-strong, orange) √
  - Conflict with other modules in other semester (weak, lightturquoise) √
  - Conflict with other tutorials of same semester (medium, turquoise) √
  - Conflict with other modules in same semester (medium, turquoise) √
  - Conflict with same module lectures (strong, darkturquoise) √
  - Lecturer conflicts as above (strong, darkred) √
  - No conflict as above (green) √


# Data Structure
- SemestersMap<SemesterNumber(20231), [ModuleMap<ModuleTitle,  {lecturer, level, optional, faculty, fixed, noOfParticipants, lectures, tutorials, exams, others}>]>
- StudyplanMap<StudyplanTitle, RelativeSemestersMap<RelativeSemesterNumber(1), [ModuleTitle]>>
- maxID
- lectures = [appointment]
- tutorials = [appointment]
- exams = [appointment]
- periods = [appointment]
- LecturersMap = <lecturerTitle, [appointment]>
- RoomsMap<roomTitle, {id, title, capacity, [appointment]}>
- appointment = {id, title, start, end, isDraggable, type, lecturer, room, ...}