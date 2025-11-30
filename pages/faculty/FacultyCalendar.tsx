import React from 'react';
import EventManager from '../../components/EventManager';

const FacultyCalendar: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Academic Calendar</h1>
      <EventManager
        title="Events & Holidays"
        description="Manage and view upcoming college events, holidays, and notices."
        canCreate={true}
        allowAllActions={true}
      />
    </div>
  );
};

export default FacultyCalendar;

