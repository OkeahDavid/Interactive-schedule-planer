import React, { useState, useRef, useEffect } from 'react'
import { isUndefined } from 'lodash'
import moment from 'moment'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../../../src/addons/dragAndDrop/styles.scss'

import { drawerHalfWidth, marginTop } from './../settings/settings'


// Tab Contents

export default function AppointmentFields({ selected, lecturers, rooms, developerMode }) {

    const [title, setTitle] = useState('');
    const [module, setModule] = useState("No Module")
    const [lecturer, setLecturer] = useState('');
    const [room, setRoom] = useState('');
    const [participants, setParticipants] = useState(0);
    const [draggable, setDraggable] = useState(true);
    const [selectedId, setSelectedId] = useState(-1010101)

    const [appointmentDate, setAppointmentDate] = useState(moment(new Date()));
    const [periodEndDate, setPeriodEndDate] = useState(moment(new Date()).add(90, 'minutes'));
    const [startTime, setStartTime] = useState(moment(new Date()));
    const [endTime, setEndTime] = useState(moment(new Date()).add(90, 'minutes'));
    const [type, setType] = useState(10);
    const [rhythm, setRhythm] = useState(0);
    // series start and end
    const [startDate, setStartDate] = useState(moment(new Date()));
    const [endDate, setEndDate] = useState(moment(new Date()).add(90, 'days'));

    const [isPeriod, setIsPeriod] = useState(false)

    useEffect(() => {
        if (selected) {
            setTitle(selected.title)
            setModule(selected.module)
            setLecturer(selected.lecturer ? selected.lecturer : '')
            setRoom(selected.room ? selected.room : '')
            setParticipants(selected.participants ? selected.participants : 0)
            setDraggable(isUndefined(selected.isDraggable) ? true : selected.isDraggable)
            setSelectedId(selected.id ? selected.id : -1010101)
            setAppointmentDate(moment(selected.start))
            setPeriodEndDate(moment(selected.end))
            setStartTime(moment(selected.start))
            setEndTime(moment(selected.end))
            setType(selected.type ? selected.type : 100)
            setRhythm(selected.rhythm ? selected.rhythm : 0)
            setStartDate(moment(selected.seriesStart ? selected.seriesStart : selected.start))
            setEndDate(moment(selected.seriesEnd ? selected.seriesEnd : selected.end))
            setIsPeriod(selected.module === "Periods")
            console.log("AppointmentFields", isPeriod, selected)
        }
    }, [selected]);


    const textFieldRef = useRef(null); // Todo: Here correct?



    return (
        <div>


            {!isPeriod &&
                <TextField
                    value={module}
                    fullWidth
                    id="module-in-drawer"
                    label="Appointment module"
                    name="appointmentmodule"
                    sx={{ mt: marginTop + 1 }}
                    onChange={(event) => setModule(event.target.value)}
                />
            }

            {/* <TitleField />*/}
            <TextField
                inputRef={textFieldRef}
                // autoFocus
                fullWidth
                id="title-in-drawer"
                label="Title"
                name="title"
                sx={{ mt: marginTop }}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
            />

            <DatePicker
                label={isPeriod ? "Start" : "Day"}
                // fullWidth
                name="datePicker"
                value={appointmentDate}
                onChange={(newValue) => { setAppointmentDate(newValue) }}
                onAccept={(newValue) => { setAppointmentDate(newValue) }}
                required
                sx={{ mt: marginTop, width: isPeriod ? drawerHalfWidth : (drawerHalfWidth * 2) }}
            />

            {isPeriod ?
                <DatePicker
                    label="End"
                    // fullWidth
                    name="datePickerEnd"
                    value={periodEndDate}
                    onChange={(newValue) => { setPeriodEndDate(newValue) }}
                    onAccept={(newValue) => { setPeriodEndDate(newValue) }}
                    required
                    sx={{ mt: marginTop, width: drawerHalfWidth }}
                />

                :
                <div>
                    <TimePicker label="Starttime"
                        name="starttime11"
                        value={startTime}
                        onChange={setStartTime}
                        required
                        sx={{ width: drawerHalfWidth, mt: marginTop }}
                    />

                    <TimePicker label="Endtime"
                        name="endtime11"
                        value={endTime}
                        onChange={(newValue) => { setEndTime(newValue) }}
                        required
                        sx={{ width: drawerHalfWidth, mt: marginTop }}
                    />

                    <FormControl sx={{ width: drawerHalfWidth, mt: marginTop }}>
                        <InputLabel id="demo-simple-select-label">Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={type}
                            label="Type"
                            onChange={(event) => setType(event.target.value)}
                            name="typeSelect"
                            required
                        >
                            {/* Todo: Key and value can be the same -> only string array. That could make it possible for the user to add new types. But the app logic would have to be changed. */}
                            <MenuItem value={10}>Lecture</MenuItem>
                            <MenuItem value={20}>Tutorial</MenuItem>
                            <MenuItem value={30}>Exam</MenuItem>
                            <MenuItem value={40}>Block</MenuItem>
                            <MenuItem value={50}>Seminar</MenuItem>
                            <MenuItem value={100}>Other</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ width: drawerHalfWidth, mt: marginTop }}>
                        <InputLabel id="rhythm-select-label">Rhythm</InputLabel>
                        <Select
                            labelId="rhythm-select-label"
                            id="rhythm-select"
                            value={rhythm}
                            label="Rhythm"
                            onChange={(event) => setRhythm(event.target.value)}
                            name="rhythmSelect"
                            required
                        >
                            {/* Todo: Key and value can be the same -> only string array */}
                            <MenuItem value={0}>Single</MenuItem>
                            <MenuItem value={1}>Daily</MenuItem>
                            <MenuItem value={7}>Weekly</MenuItem>
                            <MenuItem value={14}>Bi-Weekly</MenuItem>
                            <MenuItem value={28}>Monthly</MenuItem>
                            <MenuItem value={9}>Irregularly</MenuItem>
                        </Select>
                    </FormControl>

                    <div>
                        <DatePicker
                            label={rhythm === 0 ? "Original date" : "Start date"}
                            fullWidth
                            name="startDate"
                            value={startDate}
                            onChange={(newValue) => { setStartDate(newValue) }}
                            onAccept={(newValue) => { setStartDate(newValue) }}
                            required
                            sx={{ mt: marginTop, width: drawerHalfWidth }}
                        />

                        <DatePicker
                            label={rhythm === 0 ? "Original date" : "End date"}
                            fullWidth
                            name="endDate"
                            value={endDate}
                            onChange={(newValue) => { setEndDate(newValue) }}
                            onAccept={(newValue) => { setEndDate(newValue) }}
                            required
                            sx={{ mt: marginTop, width: drawerHalfWidth }}
                        />
                    </div>

                </div>}


            {!isPeriod && <div>

                {/* <LecturerField /> */}
                <Autocomplete
                    sx={{ mt: marginTop }}
                    options={lecturers}
                    getOptionLabel={(option) => option}
                    id="controlled-lecturer"
                    freeSolo
                    autoSelect
                    value={lecturer}
                    onChange={(event, newValue) => {
                        setLecturer(newValue);
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Lecturer" name="lecturer" />
                    )}
                />

                {/* <RoomField /> */}
                <Autocomplete
                    sx={{ mt: marginTop }}
                    fullWidth
                    options={rooms}
                    getOptionLabel={(option) => option}
                    id="controlled-room"
                    freeSolo
                    autoSelect
                    value={room}
                    onChange={(event, newValue) => {
                        setRoom(newValue);
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Room" name="room" />
                    )}
                />

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* <NumberOfParticipants/> */}
                    <TextField
                        id="outlined-number"
                        label="Participants"
                        name="participants"
                        type="number"
                        sx={{ width: drawerHalfWidth, mt: marginTop }}
                        value={participants}
                        onChange={(event) => { setParticipants(event.target.value) }}
                    />

                    <FormControlLabel sx={{ mt: marginTop }} control={
                        <Checkbox name="draggableCheckbox"
                            checked={draggable}
                            onChange={(event) => { setDraggable(event.target.checked) }}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    } label="Draggable" labelPlacement="start" />

                </div>


                {developerMode && <div>
                    <Divider sx={{ mt: marginTop }} />
                    <TextField
                        fullWidth id="id-in-drawer1"
                        label="selected.id"
                        name="ID1s"
                        value={selectedId}
                        sx={{ width: drawerHalfWidth, mt: marginTop }}
                    />
                </div>}
            </div>}


        </div>
    )
}
