import React from 'react';
import EventManager from '../../components/EventManager';

const StudentCalendar: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Academic Calendar</h1>
            <EventManager
                title="Events & Holidays"
                description="View upcoming college events, holidays, and notices."
                canCreate={false}
                allowAllActions={false}
            />
        </div>
    );
};

export default StudentCalendar;
