import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';

// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../../../../src/addons/dragAndDrop/styles.scss'

import { mapType, mapRhythm } from '../../tools/functions'
import { getSemesterStringFromAppointment } from '../../tools/functions';



export default function CollapsibleTable(rows, grouping,
    addDefaultObject, editObject, copyObject, deleteObject,
    copyGrouping, editGrouping, deleteGrouping
) { // Todo: Maybe a DataGrid is better, we could offer both of them and enable to switch. (See https://mui.com/material-ui/react-table/#data-table)

    // console.log("CollapsibleTable", rows) // Todo why is it called so many times, although the dialog is not open?
    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell>Active</TableCell>
                        <TableCell />
                        <TableCell>{grouping.substring(0, grouping.length - 1)}</TableCell>
                        <TableCell>Number</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.entries(rows).map(([key, value]) => {
                        return <Row key={key} row={{ name: key, appointments: value }}
                            grouping={grouping} addDefaultObject={addDefaultObject}
                            editObject={editObject} copyObject={copyObject} deleteObject={deleteObject}
                            copyGrouping={copyGrouping} editGrouping={editGrouping} deleteGrouping={deleteGrouping}
                        />
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function Row({
    row, grouping, addDefaultObject, editObject, copyObject, deleteObject,
    copyGrouping, editGrouping, deleteGrouping }
) {
    const [openExpansion, setOpenExpansion] = useState(false);
    // console.log("Row", grouping, row
    //     // addDefaultObject, editObject, copyObject,
    //     // copyGrouping, editGrouping, deleteGrouping
    // )

    const object = useMemo(() => {
        return (grouping === "Semesters" || grouping === "Studyplans") ? "module" : "appoinment";
    }, [grouping])

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <Checkbox
                        defaultChecked
                        // checked={draggable}
                        // inputProps={{ 'aria-label': 'controlled' }}
                        onChange={(event) => { console.log("To be implemented", event.target.value, event) }}
                    />
                </TableCell>

                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpenExpansion(!openExpansion)}
                    >
                        {openExpansion ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>

                <TableCell component="th" scope="row">{row.name}</TableCell>
                <TableCell>{row.appointments.length}</TableCell>
                <TableCell align="right">
                    {grouping !== "Lecturers" && grouping !== "Rooms" && grouping !== "Types" && <Tooltip title={"Copy " + (grouping === "Periods" ? "Semester" : grouping.substring(0, grouping.length - 1))}>
                        <IconButton
                            fontSize='inherit'
                            color="inherit"
                            edge="end"
                            onClick={copyGrouping(row.name)} >
                            <AddIcon name="rowAddIcon" fontSize='inherit' />
                        </IconButton>
                    </Tooltip>}
                </TableCell>
                <TableCell align="right">
                    {grouping !== "Types" && <Tooltip title={"Edit " + (grouping === "Periods" ? "Semester" : grouping.substring(0, grouping.length - 1))}>
                        <IconButton
                            fontSize='inherit'
                            color="inherit"
                            edge="end"
                            onClick={editGrouping(row.name, grouping)} >
                            <EditIcon fontSize='inherit' />
                        </IconButton>
                    </Tooltip>}
                </TableCell>
                <TableCell align="right">
                    {grouping !== "Types" && <Tooltip title={"Delete " + (grouping === "Periods" ? "Semester" : grouping.substring(0, grouping.length - 1))}>
                        <IconButton
                            color="inherit"
                            onClick={deleteGrouping(row.name)}>
                            <DeleteIcon fontSize='inherit' />
                        </IconButton>
                    </Tooltip>}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={openExpansion} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            {/* <Typography variant="h6" gutterBottom component="div">
                      Appointments
                    </Typography> Todo: This should provide sorting and simple filtering (use DataGrid) */}
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell />
                                        <TableCell>{(grouping === "Semesters" || grouping === "Studyplans") ? "Modules" : "Appoinments"}</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Rhythm</TableCell>
                                        <TableCell>{grouping === "Periods" ? "Start" : "Lecturer"}</TableCell>
                                        <TableCell align="right">{(grouping === "Semesters") ? "LV" : grouping === "Periods" ? "End" : "Semester"}</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell align="right">
                                            {grouping !== "Periods" && <Tooltip title={"Add default " + object}>
                                                <IconButton color="primary" onClick={() => { addDefaultObject(row.name) }}>
                                                    <AddIcon fontSize='inherit' />
                                                </IconButton>
                                            </Tooltip>}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.appointments.map((a) => {
                                        // console.log("key", a)
                                        return (
                                            <TableRow key={a.id}>
                                                <TableCell>
                                                    <Checkbox
                                                        defaultChecked
                                                        // checked={draggable}
                                                        // inputProps={{ 'aria-label': 'controlled' }}
                                                        onChange={(event) => { console.log("To be implemented", event.target.value, event) }}
                                                    />
                                                </TableCell>
                                                <TableCell component="th" scope="row">{a.title}</TableCell>
                                                <TableCell>{mapType(a.type)}</TableCell>
                                                <TableCell>{mapRhythm(a.rhythm)}</TableCell>
                                                <TableCell>{grouping === "Periods" ? a.start.toDateString() : a.lecturer}</TableCell>
                                                <TableCell align="right">{grouping === "Periods" ? a.end.toDateString() : getSemesterStringFromAppointment(a)}</TableCell>
                                                <TableCell align="right">
                                                    {grouping !== "Periods" && <Tooltip title={"Copy " + object}>
                                                        <IconButton
                                                            fontSize='inherit'
                                                            color="primary"
                                                            edge="end"
                                                            onClick={() => copyObject(a)} >
                                                            <AddIcon name="elementAddIcon" fontSize='inherit' />
                                                        </IconButton>
                                                    </Tooltip>}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Tooltip title={"Edit " + object}>
                                                        <IconButton
                                                            fontSize='inherit'
                                                            color="primary"
                                                            edge="end"
                                                            onClick={editObject(a)} >
                                                            <EditIcon fontSize='inherit' />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell align="right">
                                                    {grouping !== "Periods" && <Tooltip title={"Delete " + object}>
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => deleteObject(a, grouping === "Semesters" ? "deleteModule" : grouping === "Studyplans" ? "deleteStudyplanModule" : a.module)}>
                                                            <DeleteIcon fontSize='inherit' />
                                                        </IconButton>
                                                    </Tooltip>}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        // calories: PropTypes.number.isRequired,
        // carbs: PropTypes.number.isRequired,
        // fat: PropTypes.number.isRequired,
        // history: PropTypes.arrayOf(
        //   PropTypes.shape({
        //     amount: PropTypes.number.isRequired,
        //     customerId: PropTypes.string.isRequired,
        //     date: PropTypes.string.isRequired,
        //   }),
        // ).isRequired,
        // name: PropTypes.string.isRequired,
        // price: PropTypes.number.isRequired,
        // protein: PropTypes.number.isRequired,
    }).isRequired,
};


