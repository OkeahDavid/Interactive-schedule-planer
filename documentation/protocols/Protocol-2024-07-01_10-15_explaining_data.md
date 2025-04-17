01.07.2024 10:15 - Interactive Schedule Planer

# Protocol - Explaining Data

Present: Alexander, Mostafa, Michael, Prof. Bockisch

## Workflow to create new schedule
There are two data sources, a JSON and a XLS file. 
- First a JSON file is used to read old data. The modules are displayed in a list. From the list there can be selected the desired appointments or modules, which are loaded into the calendar.
- Then it is modified and new modules are created. 
- Having a ready schedule it should be downloadable into a human readable form.
- The schedule is manually transferred into Marvin. 
- In Marvin the schedule can be further modified in respect to other study plans and room management.
- Marvin contains the authoritative schedule. It can be downloaded.
- It should be possible to upload the download from Marvin into the interactive schedule planner. Changes should be highlighted.

The json file is very large. We do not need all of the data. Prof. Bockisch wants to provide a smaller file.

The download from Marvin is a xls file. There may be difficulties to import it. Beneath it is XML. 
From Marvin there can be downloaded the current and the next semester. Internal events can be ignored.

There are lectures, exercises, exams and seminars.

Creating new modules or appointments it may be nice to have an auto complete field.

In the appointments list there may be selected a default value.

For planning it may be enough to see an exemplary week including biweekly and block appointments.

## Answers to questions
- We do not need whole day events in the calendar. 
- The default for appointments may be 2 hours.
- The editing field may be moved to a sidebar on the right.
- We may use JavaScript instead of TypeScript.