29.08.2024 15:00 - Interactive Schedule Planer

# Protocol - 3rd Milestone

Present: Alexander, Mostafa, Michael and Prof. Bockisch

## Presentation of progress
- Some features we did not implement yet. Instead we implemented others.

## Clarifications
- Record changes: When uploading an initial schedule, working on it and finalizing it, there should be a printable version of the before and after, highlighting what has been changed.
- Bi-weekly appointments should be marked appropriately.
- We are to think in 2 hours timeslots. But c.t. and s.t. may be noted.
- In the Grouping Dialog there should be the possibility to select and deselect all.
- Copying semesters and periods should be done correctly, adjusting the times correctly.
- Periods: Last lecture week is first exam week. First exam period lasts 3 weeks. The second lecture period lasts two weeks and comprises the last two complete weeks in March or September.
- The downloading format we can choose ourselves, but it should be uploadable again.
- Human readable format: It should be possible to show the schedule to others so that they can confirm or deny the schedule. Ideas:
    - PDF with schedule
    - JSON file, which lecturers can upload in our app, or which is human readable.
    - Link to our app or another website where their schedule is displayed. Maybe this can be acheived by setting filters.
    - Excel also may be an option as most lecturers are familiar with Excel.
- How improve performance? Use profilers. Update in less than a second is ok.
- Studyplans can be found on the website: [Link](https://www.uni-marburg.de/de/fb12/studium/studiengaenge)
- Conflicts:
    - Studyplan modules per Semester should not overlap.
    - Studyplan modules should not overlap with the modules of the next year, as some may have to repeat modules.
    - Summer and winter study start may be treated as two different studyplans (especially Computer Science).

## Todo
- We may meet again in the week before the lecture period starts.

## Milestones
### Until Milestone 4a) - 26.9.2024
- Convenient import & export & management of data
- Calculation of conflicts
- Highlight conflicts

### Until Milestone 4b) - 31.10.2024
- HTML 5 local storage – auto save calendar 
- Gitlab Page as host
- Resolve todos
- Improve code & performance
- Tests

### Until Acceptance Meeting - 6.11.2024
- Make final report from partly reports.
