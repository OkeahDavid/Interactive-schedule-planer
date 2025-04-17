13.05.2024 - 14:15 - Interactive Schedule Planer

# Protocol - 1st Meeting with Prof. Bockisch

Present: Alexander, Mostafa, Michael, Prof. Bockisch

## Organizational
Calculating the times we may do it backwards. 1 credit = 30 hours

12 Credit points x 30 hours x 3 developers = 1080 hours for the project available

For each of the 4 Milestones we could use 270 hours.

We could finish in November, making the acceptance testing 2 weeks before.

If we make frequent reviews the acceptance testing should be easy.

In the end we need to make a final presentation and a screen video.

We want to have regular meetings with Prof. Bockisch. He asked us to contact him by email for an appointment.

Scrum is meant for people working full time. But as we are working only a few hours per week, we need to stretch it. Or the other way around: Our Sprints will not encompass many issues (we do short sprints).
- Daily Scrum → Weekly Scrum
- Sprint Meeting (2-4 weeks) → Monthly Sprint Meetings (with Prof. Bockisch?)

Scrum aims at shortening the meeting times.

Upcoming workshops:
- Gitlab workshop
- Web App workshop

## Presentation
During Milestones we just show our progress briefly, share experiences, get feedback.

## Documentation
We do not need to make the documentation exactly as in the guide line. The documentation is for the user who wants to use the app, and for developers who want to continue on the project.

In the web app there could be a help page and tool tips.

In the documentation the development process should become apparent and the software management: 
- How is the process turned into a reality? 
- How do we track issues? User cards?
- To whom do we assign issues?
- Clear structure, who is working on what part.
- Architecture

## Technical Matters
Material UI is preferred as it is used in other projects, too. And the appearance can be kept simple. The default settings of Material UI may already be sufficient.

React: Use latest version. The version can be pinned in the project definition.

Preview with TypeScript (recommended over JavaScript)

We may use any Node packages, we want.

Important things about implementation:
- Functionality and usability!
- Robustness and correctness!
- Easy checking if all courses can be taken
- Think about a data model.
- Moving appointments
- Discovering and analyzing conflicts
- Not: Fancy graphical appearance or uniform look and feel
- Not: Responsiveness for mobile phones.
- Not: Automatic optimizer for schedule

Sample page: https://www.mathematik.uni-marburg.de/studium/preview/index.html

At the moment the planning is still done manually.

## Constraints / Challenges
- All study programs need to be studiable
- No conflicts with courses that need to be visited together
- No overlaps
- Recommended study schedules of study programs: Student should be able to follow the schedule.
- Professors can hold only one lecture at once.
- Appointments between 8:00 and 20:00 o’clock.
- When do courses take place? Winter, Summer, Irregular
- Exams can be on Saturday.
- Try to keep Wednesday afternoon (14:00) free from lectures (weak conflict)
- ( Monday to Wednesday lectures)
- (Thursday to Friday exercises)
- Number of participants (Courses offered in many study programs attract many students.). Not too many big rooms should be needed at once. (Usually it is done like this: After fixing dates the rooms are being requested.)
- Constraints from Bachelor courses most important.
- Study programs (May have to be entered manually. It should be flexible.):
  - Computer Science (start in winter or summer)
  - Business Informatics
  - Mathematics
  - Minor Mathematics
  - Business Mathematics
  - DataScience
  - Teaching profession
  - Finance
  - Cultural data studies
- Basic courses, like OOP usually do not change, should be specially protected (e.g. warning). Some basic courses change with professor.
- Advanced courses are more flexible.

## Done:
- Question answered: Previous requirements ("Minimum Viable Product" / mandatory / optional) → In the previous requirements what is mandatory and what is optional.
- Question answered: Partly documents may deviate from the guideline. Basically it is about:
  - Usability: The user should know how to use it.
  - Passing on: Future developers should know how to proceed.
- Question answered: Prof. Bockisch prefers to have everything in Gitlab. We do not need to invite him to Hessenbox.

## Todo:
- Work out all the rest of the requirements.
- Estimate time.
- Work out schedule until the end (3rd and 4th milestone and delivery).
- In a few weeks we need to ask Prof. Bockisch for the data.
- Finish presentation