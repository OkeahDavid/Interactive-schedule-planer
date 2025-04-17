
//////////////////////////////////////////////////////////////
// Extra features
import React, { useState } from 'react'


// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../../../src/addons/dragAndDrop/styles.scss'


export const DateParser = () => {
    const [dateString, setDateString] = useState('2023-06-20');
    const [parsedDate, setParsedDate] = useState(null);

    const handleDateStringChange = (event) => {
        setDateString(event.target.value);
    };

    const parseDate = () => {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            setParsedDate(date);
        } else {
            setParsedDate(null);
        }
    };

    return (
        <div>
            <input type="text" value={dateString} onChange={handleDateStringChange} />
            <button onClick={parseDate}>Parse Date</button>
            {parsedDate ? <p>Parsed Date: {parsedDate.toLocaleString()}</p> : "Use for example: 2015-03-13T09:30:00"}
        </div>
    );
};
