// Module to store and access the initial appointments for change detection
let initialAppointments = [];

export function setInitialAppointments(appointments) {
  // Deep copy to avoid mutation
  initialAppointments = JSON.parse(JSON.stringify(appointments));
}

export function getInitialAppointments() {
  return initialAppointments;
}

// Utility to compare two appointments by id and key fields
export function isAppointmentChanged(current, initialList) {
  const match = initialList.find(
    (a) => a.id === current.id
  );
  if (!match) return true; // New appointment
  // Compare key fields (title, start, end, type, room, lecturer, etc.)
  return (
    current.title !== match.title ||
    new Date(current.start).getTime() !== new Date(match.start).getTime() ||
    new Date(current.end).getTime() !== new Date(match.end).getTime() ||
    current.type !== match.type ||
    current.room !== match.room ||
    current.lecturer !== match.lecturer
  );
}
