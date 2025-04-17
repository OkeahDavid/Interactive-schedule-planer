# Specification - Interactive Schedule Planner

Contents:

[[_TOC_]]


# Technical requirements
- The application shall be browser based (without a server).
- Using Typescript or Javascript.
- Using React.
- Using Material UI.
- The current planning should be stored in the HTML 5 local storage such that the status is not lost if the web page is closed accidentally and planning can be continued when the page is opened again. 
- Using Node Package Manager for the build configuration.
- Using Gitlab Page as host.



# Non-functional requirements

## 2.100.0 It should look nice.

## 3.0.1 It should be intuitive.




# 1st Milestone - Organizational Matters & Planning


# 2nd Milestone - Minimal Viable Product

## Introduction

## Definitions





# Functional Requirements

## 2.0.0 Template
**Short description:**

**Actor:**

**Preconditions:**

**Procedure:**

**Result:**


## 2.0.0 Landing Page
**Short description:** Having downloaded the website there should be displayed a welcome screen.

**Actor:** User

**Preconditions:** The website has been requested through the browser.

**Procedure:** When building the website a little browser-program is downloaded, too. First there is shown an empty calendar. When the download is ready there shall be displayed a field hovering above the calendar with a welcome text and the request to upload a file. For this there shall be a drag&drop-field and a button for upload via file selection.

**Result:** The welcome screen is shown with the suggestion and possibility to upload a file.




## 2.1.1 Uploading File per Drag & Drop
**Short description:** Having a drag&drop-field a file can be dropped there to upload it.

**Actor:** User

**Preconditions:** The website has been fully loaded.

**Procedure:** The user drags and drops a file into the drag&drop-field. Then the upload starts immediately and its data is included into the calendar.

**Error condition:** If an incompatible file has been uploaded there shall be shown an error massage with a hint what files are accepted. The error message shall disappear after 5 seconds. It shall be possible to click it away, too, by an X-button or by clicking anywhere outside the error message field

**Result:** The calendar is displayed with the data from the file.




## 2.1.2 Uploading File per File Selection
**Short description:** A dialogue window can be opened, where a file can be selected to upload it.

**Actor:** User

**Preconditions:** The website has been fully loaded.

**Procedure:** The user clicks on the button to open the dialogue window. The window opens and the user navigates to the desired file and uploads it either by double clicking it or by selecting it and then clicking upload. Then the upload starts immediately and its data is included into the calendar. There shall be an option to escape.

**Error condition:** If an incompatible file has been uploaded there shall be shown an error massage with a hint what files are accepted. The error message shall disappear after 5 seconds. It shall be possible to click it away, too, by an X-button or by clicking anywhere outside the error message field

**Result:** The calendar is displayed with the data from the file.




## 2.2.1 Downloading File
**Short description:** Any time the displayed calendar can be downloaded as a file.

**Actor:** User

**Preconditions:** The calendar is being displayed.

**Procedure:** Any time the user can click on the download button. Then a downloading message is displayed and all the information of the present calendar is put into a file and stored in the downloads folder of the browser. Then the message disappears.

**Result:** A file is in the downloads folder of the browser and the calendar is shown again.




## 2.3.1 Creating an Appointment via button
**Short description:** A new appointment can be created in the calendar by button.

**Actor:** User

**Preconditions:** The calendar is being displayed.

**Procedure:** The user clicks on the button „New Appointment“ and a field opens with all the input options: There can be entered the title of the appointment, the type, the name of the lecturer, the room (optional), the expected number of participants (optional), a date can be chosen and a rhythm (optional, default weekly). Then the user clicks „Save“ and the appointment is included into the calendar. There shall be the option to escape.

**Error condition:** If a non-optional field is missing an error message shall be displayed for 5 seconds mentioning the missing fields.

**Result:** The new appointment is included into the calendar.




## 2.3.2 Creating an Appointment via double click
**Short description:** A new appointment can be created in the calendar via double click.

**Actor:** User

**Preconditions:** The calendar is being displayed.

**Procedure:** The user double clicks in the calendar where the new appointment is to be created and a field opens with all the input options: There can be entered the title of the appointment, the type, the name of the lecturer, the room (optional), the expected number of participants (optional), a date can be chosen and a rhythm (optional, default weekly). The date is pre-chosen by the place where the double click occurred. Then the user clicks „Save“ and the appointment is included into the calendar. There shall be the option to escape.

**Error condition:** If a non-optional field is missing an error message shall be displayed for 5 seconds mentioning the missing fields.

**Result:** The new appointment is included into the calendar.


## 2.3.3 Creating an Appointment via Click & Drag
**Short description:** A new appointment can be created by clicking and dragging in the calendar.

**Actor:** User

**Preconditions:** The calendar is being displayed.

**Procedure:** The user clicks in the calendar where the new appointment is to be created and then drags it to the desired time. Then a field opens with all the input options: There can be entered the title of the appointment, the type, the name of the lecturer, the room (optional), the expected number of participants (optional), a date can be chosen and a rhythm (optional, default weekly). The date is pre-chosen by the place where the double click occurred. Then the user clicks „Save“ and the appointment is included into the calendar. There shall be the option to escape.

**Error condition:** If a non-optional field is missing an error message shall be displayed for 5 seconds mentioning the missing fields.

**Result:** The new appointment is included into the calendar.



## 2.4.1 Editing Appointment
**Short description:** An appointment in the calendar can be edited.

**Actor:** User

**Preconditions:** The calendar is being displayed.

**Procedure:** The user double clicks on the desired appointment or on the icon „Edit“. Then a field opens with all the editing options: The title of the appointment, the type, the name of the lecturer, the room (optional), the expected number of participants (optional), the date and the rhythm can be edited. Then the user clicks „Save“ and the appointment is updated in the calendar. There shall be the option to escape.

**Error condition:** If a non-optional field is missing an error message shall be displayed for 5 seconds mentioning the missing fields.

**Result:** The changed appointment is updated in the calendar.




## 2.4.2 Moving Appointment per Drag & Drop
**Short description:** The time of an appointment can be changed by drag & drop.

**Actor:** User

**Preconditions:** The calendar with existing appointments is visible.

**Procedure:** The user clicks on an appointment rectangle and drags it to a different place in the calendar. The rectangle is placed where the user drops it and time and date of the appointment are updated.

**Result:** The time and date of moved appointment is updated and it is seen where it has been moved.


## 2.4.3 Moving Appointment Borders per Drag & Drop
**Short description:** The borders of an appointment can be dragged. The corresponding time is changed.

**Actor:** App

**Preconditions:** The calendar with appointments is visible.

**Procedure:** Clicking on an appointment border and dragging it will change the corresponding time.

**Result:** The appointment is shown with the changed time.




## 2.5.1 Deleting Appointment
**Short description:** Any Appointment can be deleted.

**Actor:** User

**Preconditions:** The calendar with existing appointments is visible.

**Procedure:** The user clicks on the delete button of an appointment. Then the user is asked if the appointment shall be deleted. The user can confirm or abort.

**Result:** After confirming the deletion, the appointment is removed from the calendar.




## 2.5.2 Deleting All Appointments
**Short description:** All appointments of the calendar can be removed.

**Actor:** User

**Preconditions:** The calendar is visible.

**Procedure:** The user clicks on the clear button of the calendar. Then the user is asked if all appointments shall be deleted. The user can confirm or abort

**Result:** After confirming the deletion, all appointments are removed from the calendar.








# 3rd Milestone - Storage & Retreival & Organizing Events




## Introduction
Until the 3rd milestone we want to implement
the full functionality of storage and retreival and
the full functionality of organizing events

## Definitions
- Menu: An icon in the upper left or right corner. Clicking on it opens a list with different options: Return to Welcome Dialogue, Download Calendar, Upload Calendar, Go To Date, Select Number of Weeks, Filter, Chose Auto Save Folder, Delete Old Auto Saved Files, Define Lecture and Exam Periods, Create Course
- Welcome Screen: What can be seen, when requesting the app. The dialogue can be opened later again. But the calendar in the background may be filled.





## 3.0.0 Landing Page / Welcome View
**Short description:** Having downloaded the website there should be displayed a welcome dialogue.

**Actor:** User

**Preconditions:** The website has been requested through the browser.

**Procedure:** When building the website a little browser-program is downloaded, too. First there is shown an empty calendar. When the download is ready there shall be displayed a field hovering above the calendar with a welcome text and the request to continue with the last session, to upload a file or to design the calendar from scratch. For this there shall be a drag&drop-field, a button for upload via file selection, a button for continuing with the last session and a button to start from scratch.

**Result:** The welcome screen is shown with the suggestion and possibility to upload a file and a start-from-scratch button.




## 3.0.1 Start from Scratch
**Short description:** The user can start with an empty calendar and add appointments.

**Actor:** User

**Preconditions:** The start-from-scratch button has been pushed.

**Procedure:** The user sees an empty calendar and can navigate through it. Having found a desired place a new appointment can be created. There is always the option to return to the welcome screen.

**Result:** A calendar with new appointments only created by the user.




## 3.0.2 Return to Welcome View
**Short description:** From any position in the app it is possible to return to the welcome view.

**Actor:** User

**Preconditions:** The calendar app is open somewhere.

**Procedure:** In the upper right or left corner there shall be a menu button. Clicking on it opens a menu, where the welcome view can be selected. Selecting it opens the welcome dialogue.

**Result:** The welcome dialogue is opened above the current calendar.





## 3.1.1 Uploading File per Drag & Drop
**Short description:** Having a drag&drop-field a file can be dropped there to upload it.

**Actor:** User

**Preconditions:** The website has been fully loaded and the Welcome Dialogue is being shown.

**Procedure:** The user drags and drops a file into the drag&drop-field. Then the user is asked if the data shall be added to the current calendar, or if the current calendar shall be replaced by the data. There is an escape option, too. After the decision of the user the upload starts immediately and its data is included into the calendar.

**Error condition:** If an incompatible file has been uploaded there shall be shown an error massage with a hint what files are accepted. The error message shall disappear after 5 seconds. It shall be possible to click it away, too, by an X-button or by clicking anywhere outside the error message field

**Result:** The calendar is displayed with the data from the file.





## 3.1.2 Uploading File per File Selection
**Short description:** A dialogue window can be opened, where a file can be selected to upload it.

**Actor:** User

**Preconditions:** The website has been fully loaded.

**Procedure:** The user clicks on the button to open the dialogue window. The window opens and the user navigates to the desired file and uploads it either by double clicking it or by selecting it and then clicking upload. There shall be an option to escape, too. Then the user is asked if the data shall be added to the current calendar, or if the current calendar shall be replaced by the data. There is an escape option, too. After the decision of the user the upload starts immediately and its data is included into the calendar.

**Error condition:** If an incompatible file has been uploaded there shall be shown an error massage with a hint what files are accepted. The error message shall disappear after 5 seconds. It shall be possible to click it away, too, by an X-button or by clicking anywhere outside the error message field

**Result:** The calendar is displayed with the data from the file.




## 3.1.3 Uploading Initial Schedule
**Short description:** Schedules already exist

**Actor:** Programmers

**Preconditions:** Files can be uploaded

**Procedure:** The existing schedule needs to be examined for compatibility with the upload format. Either it should be possible to define a schema, or we use the existing schema as upload format, or the existing schema is adjusted manually or we write an adaptor.

**Exeptions:** Missing or false values may cause errors. A message should be displayed where the error is discribed.

**Result:** A file is available, that can be fully uploaded into the app.




## 3.1.5 Select Modules to be Imported

**Short description:** When importing a file the available modules shall be displayed to be selected.

**Actor:** User

**Preconditions:** A file has been loaded.

**Procedure:** After loading the file the available modules shall be shown in a Material UI transfer list. Some modules shall be selected by default. On clicking "Import" the selected modules shall be imported into the calendar.

Alternatively maybe it is better to use a check list with preselected modules.

**Result:** The selected modules are imported into the calendar.





## 3.2.1 Downloading File
**Short description:** Any time the displayed calendar can be downloaded as a file.

**Actor:** User

**Preconditions:** The calendar is being displayed.

**Procedure:** Any time the user can click on the menu and choose to download the calendar. Then a dialogue is displayed where the user can define a schema, choose human readable form or just click on default. An escape option shall be available, too. After choosing a download option a downloading message is displayed and all the information of the present calendar available by the filters is put into a file and stored in the downloads folder of the browser. Then the message disappears. If filters are applied this shall be mentioned in the download message as a warning. For the 3rd milestone filters are never applied.

**Result:** A file is in the downloads folder of the browser and the calendar is shown again.




## 3.2.2 Human Readable Form
**Short description:** A human readable form shall be available for download.

**Actor:** User

**Preconditions:** The downloading process has been started.

**Procedure:** In the human readable form the changes since starting the calendar app are notified. The human readable form can be used as instructions for booking the appointments in the course catalog and reserving corresponding rooms. The user can choose this human readable form.

**Result:** A file is generated in human readable form.




## 3.2.20 Saving Calendar
**Short description:** The Calendar is saved every 4 minutes.

**Actor:** App

**Preconditions:** The calendar app has been started.

**Procedure:** Every 4 minutes the calendar is saved to a place defined by the user. The default is the downloads folder. The filename shall have the following format: Calendar_saved_<year>_<month>_<day>_<hour>_<minute>.savedCalendar

**Exeptions:** If the auto save does not work the user shall be notified and asked to download manually.

**Result:** A new file is created in the auto save folder.




## 3.2.21 Choosing Auto Save Folder
**Short description:** The user can use a folder where the calendar is saved automatically.

**Actor:** User

**Preconditions:** The calendar app has been started.

**Procedure:** Clicking on the menu there is the option to choose an auto save folder. With this option it is possible to navigate to the desired folder and choose it. It is possible to escape, too.

**Exeptions:** If the folder cannot be chosen the user shall be notified and asked to choose a different folder.

**Result:** The auto save folder is stored in the app.




## 3.2.22 Delete Old Auto Saved Files
**Short description:** Whenever desired old auto saved files can be deleted.

**Actor:** User

**Preconditions:** The app has been started.

**Procedure:** Clicking on the menu „Delete Old Auto Saved Files“ can be chosen. Then all files except the most recent one are deleted in the auto save folder.

**Exeptions:** On error an error message is displayed.

**Result:** All auto saved files except the most recent one are deleted.



## 3.3.0 Create Repetitive Appointments
**Short description:** Appointments can be repeated daily or weekly or monthly.

**Actor:** User

**Preconditions:** The calendar with appointments is visible.

**Procedure:** Double-clicking on an appointment opens a dialogue to edit the appointment. There can be choosed the options single, daily, weekly or monthly repetitions. The first and last appointment date can be chosen. The default dates correspond to the lecture period. There is the option either to save the settings or to escape.

**Result:** The repetitive appointments are created and linked.



## 3.4.0 Define Lecture and Exam Periods
**Short description:** For a semester the lecture and exam periods can be defined.

**Actor:** User

**Preconditions:** The app has been started.

**Procedure:** Clicking on the menu the item „Define Lecture and Exam Periods“ can be chosen. Then a dialogue opens with a semester field and fields for the start end end dates of the lecture period and the two exam periods. There is the option either to save the settings or to escape.

**Exeptions:** If false dates have been entered an error shall be displayed, which disappears after 5 seconds. Then the fields can be edited again.

**Result:** The lecture and the two exam periods of one semester have been saved.




## 3.4.1 Create Course
**Short description:** A complete course can be created with all its appointments.

**Actor:** User

**Preconditions:** The welcome screen has been left and the calendar is visible.

**Procedure:** In the menu there is the option „Create Course“. In the dialogue the starting dates for lectures and exercises can be chosen from the lecture period and if they are supposed to be in a weekly, bi-weekly or irregular mode. If the irregular mode is chosen, then all dates need to be entered. By a plus icon it is always possible to ad more lectures or exams. Based on this information the two exam dates are pre-filled but can be edited as desired. An oral exam does not need a date. At the bottom there is the option to escape or to save the course.

**Exeptions:** If there is an input error, a message shall be displayed and disappear after 5 seconds.

**Result:** The new course is integrated into the calendar.




## 3.5.0 Change Mode
**Short description:** There is the lecture and the exam mode.

**Actor:** App

**Preconditions:** A lecture and an exam period have been chosen.

**Procedure:** The lecture and the exam mode are chosen automatically based on where the curser is located. If it is in the lecture period the default for new appointments is weekly and if it is the exam period then the default is irregular assuming only one date. Weekly, bi-weekly or irregular can be changed later.

**Exeptions:** If no lecture or exam period has been chosen a warning is displayed for 5 seconds, the default is irregular, but the work can be continued.

**Result:** The default values are influenced by the change mode.





## 3.6.1 Assign Colors to appointments
**Short description:** Colors can be assigned to appointments or series of appointments.

**Actor:** App

**Preconditions:** The calendar with appointments is visible.

**Procedure:** Clicking on an appointment it is possible to assign a color via color picker or by value. The default color is blue.

**Result:** The appointment or appointment series is shown in the assigned color.



## 3.6.2 Assign Colors to courses
**Short description:** Different colors can be assigned to the different appointments of a course.

**Actor:** App

**Preconditions:** The calendar with appointments is visible.

**Procedure:** In the menu the item 'Manage courses can be chosen'. A desired course then can be selected. It is possible to assign different colors for lectures, tutorials and exams.

**Result:** The appointments of the course are shown in the assigned colors.



## 3.10.1 Recording Changes
**Short description:**

**Actor:** App

**Preconditions:** An option on the welcome screen has been chosen.

**Procedure:** After starting the app and filling the calendar with an upload or starting from scratch, all the changes are being recorded.

**Result:** The recorded changes are available to be downloaded in a human readable form.



## 3.20.1 Undo Changes

**Short description:** Any operation can be reversed.

**Actor:** User

**Preconditions:** The user did some operation.

**Procedure:** Clicking on the undo button reverses the last step. Clicking on it again reverses the next last step and so on.

**Error condition:** Because of any reason an operation cannot be reversed.

**Result:** The calendar is in the state before the last step.




## 3.80.1 Go To Date
**Short description:** It is possible to jump to a chosen date

**Actor:** User

**Preconditions:** The Welcome Screen has been left.

**Procedure:** Clicking on the menu icon there is the option to jump to a date. In the dialogue it is possible to enter or choose a date. The clicks on the jump button and the calendar is shown with the chosen date as the first day in the range of shown days. There is an option to escape.

**Result:** The calendar is shown with the chosen date as the first day in the range of shown days.




## 3.80.2 Select Number of Weeks
**Short description:** In the app one or many weeks can be displayed.

**Actor:** User

**Preconditions:** The Welcome Screen has been left.

**Procedure:** Clicking on the menu icon and on the entry „Select Number of Weeks“ there opens a dialogue with a number field showing the present number of weeks displayed. There can be entered the desired number of weeks shown in the calendar at once. Clicking the „Show“ button changes the view of the calendar displaying as many weeks as were desired.

**Result:** The calendar is shown with as many weeks as desired.




## 3.80.3 Filter
**Short description:** The appointments shown can be selected and deselected.

**Actor:** User

**Preconditions:** The Welcome Screen has been left.

**Procedure:** Clicking on the menu and the item „Filter“ there is displayed a list of all appointments together with checkboxes for each appointment. The appointments may be grouped according to courses, study programs or professors to be selected or deselected all at once. After choosing the desired appointments and clicking on „Filter“ only the appointments which are checked will be shown in the calendar. There is a general option to select or deselect all at once and the process can be escaped.

**Result:** All desired appointments are shown considering the professor filter.




## 3.222.2 Unforseen Issues
**Short description:** This requirement is only for the schedule estimations.








# 4th Milestone - Highlighting Conflicts



## Introduction
Until the 4th milestone we want to implement
- the calculation of conflicts and
- the highlighting of conflicts

## Definitions
- Menu: An icon in the upper left or right corner. Clicking on it opens a list with different options: Return to Welcome Dialogue, Download Calendar, Upload Calendar, Go To Date, Select Number of Weeks, Filter, Chose Auto Save Folder, Delete Old Auto Saved Files, Define Lecture and Exam Periods, Create Course, Show Conflicts, Study Plans, Lecturers

- Welcome Screen: What can be seen, when requesting the app. The dialogue can be opened later again. But the calendar in the background may be filled.

- Calender-Schedule-File: A file, that contains all the appointments, courses, study plans and a set of lecturers. Usually it is generated by download.

- Study-Plans-File: A file, that contains study plans, which can be uploaded. Usually it is generated by download.

- Lecturers Set: A set of all the lecturers in the calendar, held in main memory.

- Lecturers-File: A file with a set of lecturers, that is generated by download.




## 4.1.1 Uploading File per Drag & Drop
**Short description:** Having a drag&drop-field a file can be dropped there to upload it.

**Actor:** User

**Preconditions:** The website has been fully loaded and the Welcome Screen is being shown.

**Procedure:** The user drags and drops a file into the drag&drop-field. Then the user is asked if the data shall be added to the current calendar, or if the current calendar shall be replaced by the data. There is an escape option, too. After the decision of the user the upload starts immediately and its data is included into the calendar. Besides appointments and courses there are also included study plans and a set of lecturers.

**Error condition:** If an incompatible file has been uploaded there shall be shown an error massage with a hint what files are accepted. The error message shall disappear after 5 seconds. It shall be possible to click it away, too, by an X-button or by clicking anywhere outside the error message field

**Result:** The calendar is displayed with the data from the file.



## 4.1.2 Uploading File per File Selection
**Short description:** A dialogue window can be opened, where a file can be selected to upload it.

**Actor:** User

**Preconditions:** The website has been fully loaded.

**Procedure:** The user clicks on the button to open the dialogue window. The window opens and the user navigates to the desired file and uploads it either by double clicking it or by selecting it and then clicking upload. There shall be an option to escape, too. Then the user is asked if the data shall be added to the current calendar, or if the current calendar shall be replaced by the data. There is an escape option, too. After the decision of the user the upload starts immediately and its data is included into the calendar. Besides appointments and courses there are also included study plans and a set of lecturers.

**Error condition:** If an incompatible file has been uploaded there shall be shown an error massage with a hint what files are accepted. The error message shall disappear after 5 seconds. It shall be possible to click it away, too, by an X-button or by clicking anywhere outside the error message field

**Result:** The calendar is displayed with the data from the file.





## 4.2.1 Downloading File
**Short description:** Any time the displayed calendar can be downloaded as a file.

**Actor:** User

**Preconditions:** The calendar is being displayed.

**Procedure:** Any time the user can click on the menu and choose to download the calendar. Then a dialogue is displayed where the user can define a schema, choose human readable form or just click on default. An escape option shall be available, too. After choosing a download option a downloading message is displayed and all the information of the present calendar available by the filters is put into a file and stored in the downloads folder of the browser. Then the message disappears. If filters are applied this shall be mentioned in the download message as a warning. Besides appointments and courses there are included study plans and a set of lecturers.

**Result:** A file is in the downloads folder of the browser and the calendar is shown again.




## 4.2.2 Human Readable Form
**Short description:** A human readable form shall be available for download.

**Actor:** User

**Preconditions:** The downloading process has been started.

**Procedure:** In the human readable form the changes since starting the calendar app are notified. The human readable form can be used as instructions for booking the appointments in the course catalog and reserving corresponding rooms. The user can choose this human readable form. Besides appointments and courses there are also included study plans and a set of lecturers.

**Result:** A file is generated in human readable form.




## 4.2.20 Saving Calendar
**Short description:** The Calendar is saved every 4 minutes.

**Actor:** App

**Preconditions:** The calendar app has been started.

**Procedure:** Every 4 minutes the calendar is saved to a place defined by the user. The default is the downloads folder. The filename shall have the following format: Calendar_saved_<year>_<month>_<day>_<hour>_<minute>.savedCalendar. Besides appointments and courses there are also included study plans and a set of lecturers.

**Exeptions:** If the auto save does not work the user shall be notified and asked to download manually.

**Result:** A new file is created in the auto save folder.





## 4.3.0 Create Course
**Short description:** A complete course can be created with all its appointments.

**Actor:** User

**Preconditions:** The welcome screen has been left and the calendar is visible.

**Procedure:** In the menu there is the option „Create Course“. In the dialogue the starting dates for lectures and exercises can be chosen from the lecture period and if they are supposed to be in a weekly, bi-weekly or irregular mode. If the irregular mode is chosen, then all dates need to be entered. By a plus icon it is always possible to ad more lectures or exams. Based on this information the two exam dates are pre-filled but can be edited as desired. An oral exam does not need a date. At the bottom there is the option to escape or to save the course. As soon as the course is saved, the lecturers will be added to the lecturers set and conflicts will be analyzed.

**Exeptions:** If there is an input error, a message shall be displayed and disappear after 5 seconds.

**Result:** The new course is integrated into the calendar.




## 4.3.1 Creating an Appointment via button
**Short description:** A new appointment can be created in the calendar by button.

**Actor:** User

**Preconditions:** The calendar is being displayed.

**Procedure:** The user clicks on the button „New Appointment“ and a field opens with all the input options: There can be entered the title of the appointment, the type, the name of the lecturer, the room (optional), the expected number of participants (optional), a date can be chosen and a rhythm (optional, default weekly). Then the user clicks „Save“ and the appointment is included into the calendar. There shall be the option to escape. As soon as the appointment is saved, the lecturers will be added to the lecturers set and conflicts will be analyzed.

**Error condition:** If a non-optional field is missing an error message shall be displayed for 5 seconds mentioning the missing fields.

**Result:** The new appointment is included into the calendar.




## 4.3.2 Creating an Appointment via double click
**Short description:** A new appointment can be created in the calendar via double click.

**Actor:** User

**Preconditions:** The calendar is being displayed.

**Procedure:** The user double clicks in the calendar where the new appointment is to be created and a field opens with all the input options: There can be entered the title of the appointment, the type, the name of the lecturer, the room (optional), the expected number of participants (optional), a date can be chosen and a rhythm (optional, default weekly). The date is pre-chosen by the place where the double click occurred. Then the user clicks „Save“ and the appointment is included into the calendar. There shall be the option to escape. As soon as the appointment is saved, the lecturers will be added to the lecturers set and conflicts will be analyzed.

**Error condition:** If a non-optional field is missing an error message shall be displayed for 5 seconds mentioning the missing fields.

**Result:** The new appointment is included into the calendar.




## 4.3.3 Editing Appointment
**Short description:** An appointment in the calendar can be edited.

**Actor:** User

**Preconditions:** The calendar is being displayed.

**Procedure:** The user double clicks on the desired appointment or on the icon „Edit“. Then a field opens with all the editing options: The title of the appointment, the type, the name of the lecturer, the room (optional), the expected number of participants (optional), the date and the rhythm can be edited. Then the user clicks „Save“ and the appointment is updated in the calendar. There shall be the option to escape. As soon as the appointment is saved, the lecturers will be added to the lecturers set and conflicts will be analyzed.

**Error condition:** If a non-optional field is missing an error message shall be displayed for 5 seconds mentioning the missing fields.

**Result:** The changed appointment is updated in the calendar.




## 4.3.4 Moving Appointment per Drag & Drop
**Short description:** The time of an appointment can be changed by drag & drop.

**Actor:** User

**Preconditions:** The calendar with existing appointments is visible.

**Procedure:** The user clicks on an appointment rectangle and drags it to a different place in the calendar. The rectangle is placed where the user drops it and time and date of the appointment are updated. As soon as the appointment is dropped conflicts will be analyzed.

**Result:** The time and date of moved appointment is updated and it is seen where it has been moved.




## 4.3.5 Deleting Appointment
**Short description:** Any Appointment can be deleted.

**Actor:** User

**Preconditions:** The calendar with existing appointments is visible.

**Procedure:** The user clicks on the delete button of an appointment. Then the user is asked if the appointment shall be deleted. The user can confirm or abort. On deletion conflict are updated immediately.

**Result:** After confirming the deletion, the appointment is removed from the calendar.




## 4.3.6 Deleting All Appointments
**Short description:** All appointments of the calendar can be removed.

**Actor:** User

**Preconditions:** The calendar is visible.

**Procedure:** The user clicks on the clear button of the calendar. Then the user is asked if all appointments shall be deleted. The user can confirm or abort. On deletion all conflicts need to be deleted, too.

**Result:** After confirming the deletion, all appointments are removed from the calendar.


## 4.4.1 Example Week

**Short description:** There can be shown an example week having all possible appointments per week.

**Actor:** User

**Preconditions:** The app has been loaded and there are some appointments available.

**Procedure:** In the menu there is the item "Example Week" or "Condensed Week". When it is chosen one week is shown, where all appointments per week day are presented, showing repetitive appointments only once.

**Result:** The example week is being shown.




## 4.5.1 Show Conflicts
**Short description:** Showing conflicts can be turned on and off.

**Actor:** User

**Preconditions:** The Welcome Screen has been left.

**Procedure:** Clicking on the menu the user can select „Show Conflicts On“ or „Show Conflicts Off“ depending on the current state of showing conflicts. It is immediately activated or deactivated and the item text is being changed to the opposite. Events with strong conflicts are shown in red, with weak conflicts in yellow and with no conflicts in green. If  showing conflicts is off, then the events are shown in grey.

**Result:** Conflicts are being shown or not shown.




## 4.10.0 Study Plans
**Short description:** Study plans can be created, edited and deleted

**Actor:** User

**Preconditions:** The Welcome Screen has been left.

**Procedure:** Clicking on the menu and selecting „Study Plans“, a dialogue opens where a new study plan can be created, an existing study plan can be deleted or selected and edited. Changes are effective immediately. There is a close button to close the dialogue.

**Result:** With every change on the set of study plans conflict analysis is started immediately.




## 4.10.1 Create Study Plan
**Short description:** Study plans can be created.

**Actor:** User

**Preconditions:**

**Procedure:** A study plan has a name, several semesters and courses for each semester.

**Exeptions:** If the study plan is incomplete a warning is shown for 5 seconds and the study plan can be edited again.

**Result:** A new study plan is applied for conflict analysis.




## 4.10.2 Edit Study Plan
**Short description:** Study plans can be edited.

**Actor:** User

**Preconditions:**

**Procedure:** A study plan has a name, several semesters and courses for each semester.

**Exeptions:** If the study plan is incomplete a warning is shown for 5 seconds and the study plan can be edited again.

**Result:** The edited study plan is applied for conflict analysis.




## 4.10.3 Delete Study Plan
**Short description:** Study plans can be edited.

**Actor:** User

**Preconditions:**

**Procedure:**


**Result:** The deletion is applied for conflict analysis.




## 4.10.4 Download Study Plans
**Short description:** Study plans can be downloaded.

**Actor:** User

**Preconditions:**

**Procedure:**


**Result:** A file is created with all study plans.




## 4.10.5 Upload Study Plans
**Short description:** Study plans can be uploaded.

**Actor:** User

**Preconditions:**

**Procedure:**


**Result:** The upload is immediately applied for conflict analysis, if it is turned on.




## 4.10.6 Study Plan Conflict Analysis
**Short description:** Study plans are being used to analyze conflicts.

**Actor:** App

**Preconditions:** Study plans are analyzed to derive dependencies. Courses suggested to be studied in the same semester of any of the programs are in strong conflict. Courses in adjacent study years have a weak conflict.

**Procedure:**


**Result:** If turned on, conflicts are shown.





## 4.20.0 Lecturers
**Short description:** Lecturers can be added, renamed and deleted.

**Actor:** User

**Preconditions:** The Welcome Screen has been left.

**Procedure:** Clicking on the menu and selecting „Lecturers“, a list of all professors and lecturers is shown. A new lecturer can be added. Existing lecturers can be renamed. Lecturrs can be deleted. If they are mentioned in any appointments a warning is shown, which asks for confirmation or denial of the deletion. In case appointments without lecturers exist they are shown in blue. Changes are effective immediately. There is a close button to close the dialogue.

**Result:** With every change in the list of lecturers conflict analysis is started immediately.




## 4.20.1 Lecturers Collection
**Short description:** The list of lecturers is generated from the appointments, schedule uploads and manual inputs.

**Actor:** App

**Preconditions:** The Welcome Screen has been left.

**Procedure:** With the creation of every new appointment the lecturer is saved in the set of lecturers held in the app. An uploaded schedule contains a set of all its lecturers, that will be united with the set of the app.

**Result:** A set of lecturers is held in the memory of the app.




## 4.20.2 Lecturers Download
**Short description:** The list of lecturers can be downloaded.

**Actor:** User

**Preconditions:** The lecturers list is shown.

**Procedure:** Clicking on the download button, saves a list of lecturers sorted alphabetically in a file in the downloads folder.

**Result:** A sorted list of lecturers is in the downloads folder.




## 4.20.3 Lecturers Conflict Analysis
**Short description:** Lecturers are used for conflict analysis.

**Actor:** User

**Preconditions:**

**Procedure:** It is not possible for one lecturer to serve several appointments at the same time. If this is found it is marked as a strong conflict.


**Result:** If turned on, conflicts are shown.




## 4.222.2 Unforseen Issues
**Short description:** This requirement is only for the schedule estimations.


