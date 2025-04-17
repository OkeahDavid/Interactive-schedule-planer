import { DatePicker } from '@mui/x-date-pickers';

import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const semestersPerYear = ['WiSe', 'SoSe']

export function SemesterPicker(year, setYear, semester, setSemester) {
    return <div>
        <FormControl sx={{ ml: 1, width: 86 }}>
            <InputLabel id="semester-per-year-label">Semester</InputLabel>
            <Select
                labelId="semester-per-year-label"
                id="semester-per-year-select2"
                value={semester}
                label="Semester"
                onChange={(s) => { setSemester(s.target.value); }}
            >
                {semestersPerYear.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
        <DatePicker
            label={'Year'}
            openTo="year"
            views={['year']}
            value={year}
            onChange={(newValue) => {
                // console.log("year", newValue, typeof newValue, newValue.toDate(), newValue.year());
                return setYear(newValue);
            }}
            sx={{ ml: 0.1, width: 99 }}
        />
    </div>;
}
