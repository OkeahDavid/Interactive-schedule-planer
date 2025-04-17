import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment'

// Storybook cannot alias this, so you would use 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import '../../../../../src/addons/dragAndDrop/styles.scss'


export function generateSchedulePDF(visibleAppointments) {
    // Create a new jsPDF instance
    console.log("generateSchedulePDF", visibleAppointments)
    const doc = new jsPDF();

    // Add the header
    doc.setFontSize(18);
    doc.text('University Class Schedule', 14, 22);

    // Define the columns for the table
    const columns = [
        { header: 'Course Title', dataKey: 'courseTitle' },
        { header: 'Instructor', dataKey: 'instructor' },
        { header: 'Room', dataKey: 'room' },
        { header: 'Start Time', dataKey: 'startTime' },
        { header: 'End Time', dataKey: 'endTime' },
    ];

    // Prepare the data for the table by mapping your appointments
    const rows = visibleAppointments
        .filter((appointment) => appointment.start && appointment.end) // Filter out appointments without start or end times. This is only noPeriodDefault
        .map((appointment) => ({
            courseTitle: appointment.module || appointment.title || 'N/A',
            instructor: appointment.lecturer || 'N/A',
            room: appointment.room || 'N/A',
            startTime: appointment.start
                ? moment(appointment.start).format('YYYY-MM-DD HH:mm')
                : 'N/A',
            endTime: appointment.end
                ? moment(appointment.end).format('YYYY-MM-DD HH:mm')
                : 'N/A',
        }));

    // Log the rows to verify data
    console.log('Rows data:', rows);

    // Generate the table
    doc.autoTable({
        startY: 30,
        columns: columns, // Corrected from 'head' to 'columns'
        body: rows,
        styles: { fontSize: 10 },
        columnStyles: {
            courseTitle: { cellWidth: 50 },
            instructor: { cellWidth: 40 },
            room: { cellWidth: 25 },
            startTime: { cellWidth: 35 },
            endTime: { cellWidth: 35 },
        },
        didDrawPage: function (data) {
            // Add page numbers
            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(10);
            doc.text(
                `Page ${data.pageNumber} of ${pageCount}`,
                data.settings.margin.left,
                doc.internal.pageSize.height - 10
            );
        },
        margin: { top: 30 },
    });

    // Save the PDF
    doc.save('schedule.pdf');
}



// For downloading data to store it in the archive
export const downloadData = (semestersMap, lvMappings, studyplans, lecturers, rooms) => {
    const dataScheme = {
        lecturers, 
        rooms,
        studyplans: Object.entries(studyplans).reduce((prev, [k, v]) => {
            prev[k] = Object.fromEntries(v)
            return prev
        }
            , {}),
        lvMappings, 
        semestersMap
    }
    console.log(dataScheme)
    const json = JSON.stringify(dataScheme, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'dataScheme.json';
    link.click();
    URL.revokeObjectURL(link.href);
    
    // Save a complete snapshot of the data for "Continue with last Session" functionality
    const completeSnapshot = {
        timestamp: new Date().toISOString(),
        data: {
            semestersMap,
            lvMappings,
            studyplans,
            lecturers,
            rooms
        }
    };
    
    // Save the snapshot to localStorage for later retrieval
    localStorage.setItem('isp_complete_snapshot', JSON.stringify(completeSnapshot));
    
    // Clear the unsaved changes flag since we just saved everything
    localStorage.setItem('isp_has_unsaved_changes', 'false');
};
