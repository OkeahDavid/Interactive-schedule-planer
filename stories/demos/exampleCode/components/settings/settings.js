import { styled } from '@mui/material/styles';

// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../../../src/addons/dragAndDrop/styles.scss'

import MyWeek from './../dataDisplay/mainComponents/MyWeek';


export const noPeriodDefault = { id: 0, module: "Periods", title: "No period", type: 444 }

export const drawerWidth = 340;
export const drawerHalfWidth = drawerWidth / 2 - 25;
export const marginTop = 1.5; // Distance between sidebar items


// Filter components
export const ITEM_HEIGHT = 48;
export const ITEM_PADDING_TOP = 8;
export const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

// let allViews = Object.keys(Views).map((k) => Views[k])
export const allViews = { // Todo: useMemo?
    month: true,
    week: true,
    work_week: true,
    two_weeks: MyWeek,
    day: true,
    agenda: true,
}

// AppBar
export const selectProps = {
    '& .MuiInputBase-root': {
        color: 'inherit',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'inherit',
    },
    '& .MuiSvgIcon-root': {
        color: 'primary.contrastText',
    },
    '& .MuiInputLabel-root': {
        color: 'inherit',
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'inherit',
    },
}


export function getWeekDayYearDifference(semesterID) {
    const year = (semesterID - (semesterID % 10)) / 10
    const month = 3 + 6 * (semesterID % 10)
    const weekDay = new Date(year, 3, 15).getDay()
    const difference = (weekDay === 0 ? -1 : weekDay === 6 ? -2 : weekDay - 1) + (semesterID % 10) // Todo: Right formula? What about switching years? Only a problem in winter semester. Also check calculation for winter semester.
    // console.log("getWeekDayYearDifference", year, month, weekDay, difference)
    return { year, month, difference }
}



export const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.contrastText,
}));


