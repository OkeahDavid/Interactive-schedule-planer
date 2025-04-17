import React, { useCallback, useState } from 'react'
import moment from 'moment'

// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../../../../src/addons/dragAndDrop/styles.scss'

import { getSemesterIDFromDate } from '../../tools/functions'
import { GroupingDialog } from './groupingDialog';
import { PeriodsDialog } from './periodsDialog';
import { StudyPlanDialog } from './studyPlansDialog';
import { RenameDialog } from './renameDialog';
import { SemestersDialog } from './semestersDialog'
import { calculateRows } from './dataManagementFunctions'





export function GroupingDataManagement(
    grouping, openGroupingDialog, visibleDate, openAlertDialog, lecturers, rooms,
    semestersMap, setOpenGroupingDialog, updateEditingView, deleteObject,
    handleOpenGroupingDialog, setDrawerOpen, setOpenSettingsDrawer, setOpenFilterDrawer, setCurrentModule,
    showAlert, setShowAlert, alertSeverity, alertMessage, handleChange,
    setVisibleDate, setPeriod, setEditMode, setSelected, studyplans
) {
    // console.log("GroupingDataManagement", showAlert, setShowAlert, alertSeverity, alertMessage)
    const currentSemesterID = getSemesterIDFromDate(visibleDate) // Todo: Eliminate visibleDate, but pass semesterID
    const [periodStartDate2, setPeriodStartDate2] = useState(moment(visibleDate));
    const [periodEndDate2, setPeriodEndDate2] = useState(moment(visibleDate));
    const [periodTitle, setPeriodTitle] = useState("New Period");

    const [openPeriodsDialog, setOpenPeriodsDialog] = useState(false);
    const [openGroupingRename, setOpenGroupingRename] = useState(false);

    const [modifyPeriod, setModifyPeriod] = useState(false)
    const [modifyStudyplan, setModifyStudyPlan] = useState(false)

    const [changeType, setChangeType] = useState(false)
    const [oldSemester, setOldSemester] = useState("SSSS1000")


    //////////////////////////////////////////////
    //// Studyplan dialog // Todo: Move to component?

    const [studyPlanTitle, setStudyPlanTitle] = useState("New Studyplan");
    const [openStudyplansDialog, setOpenStudyplansDialog] = useState(false)
    const [openSemestersDialog, setOpenSemestersDialog] = useState(false)

    //////////////////////////////////////////////
    //// Rename dialog // Todo: Move to component?

    const [newName, setNewName] = useState("New Object");
    const [oldName, setOldName] = useState("New Object");

    const [rows, setRows] = useState({ unknown: { semester: "No semester", appointments: [] } })
    const [momentYear, setYear] = useState(moment())
    const [semester, setSemester] = useState('WiSe');


    const handleCalculateRows = useCallback((newStudyplans) => {
        console.log("handleCalculateRows()")
        setRows(calculateRows(grouping, currentSemesterID, semestersMap, newStudyplans, lecturers, rooms))
    }, [grouping, visibleDate, semestersMap, studyplans, lecturers, rooms])


    return (
        <div>
            {GroupingDialog(currentSemesterID, setOpenGroupingRename,
                openGroupingDialog, handleOpenGroupingDialog, setDrawerOpen, setOpenSettingsDrawer, setOpenFilterDrawer,
                grouping, setModifyStudyPlan, visibleDate, setVisibleDate, openAlertDialog,
                semestersMap, setOpenGroupingDialog, updateEditingView,
                showAlert, setShowAlert, alertSeverity, alertMessage, handleChange, setNewName, setOldName,
                setOpenStudyplansDialog, studyplans, lecturers, rooms,
                setOpenSemestersDialog, rows, setRows, momentYear, setYear, semester, setSemester,
                setChangeType, setOldSemester, deleteObject
            )}

            {SemestersDialog(
                openSemestersDialog, setOpenSemestersDialog, handleChange, setVisibleDate, changeType, oldSemester
            )}

            {PeriodsDialog(currentSemesterID, periodStartDate2, periodEndDate2, periodTitle, modifyPeriod,
                openPeriodsDialog, setOpenPeriodsDialog, handleChange,
                setVisibleDate,
                setPeriod, setEditMode, setSelected,
                setPeriodTitle, setPeriodStartDate2, setPeriodEndDate2
            )}

            {StudyPlanDialog(
                studyPlanTitle, setStudyPlanTitle, modifyStudyplan, handleChange,
                openStudyplansDialog, setOpenStudyplansDialog, oldName, studyplans,
                handleCalculateRows
            )}

            {RenameDialog(openGroupingRename,
                grouping, openAlertDialog, semestersMap, lecturers, rooms,
                setCurrentModule, handleChange, setOpenGroupingRename, newName, oldName,
                momentYear, setYear, semester, setSemester
            )}
        </div>
    )



}
