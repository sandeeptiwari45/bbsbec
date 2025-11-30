import React from 'react';
import EventManager from '../../components/EventManager';

const AdminCalendar: React.FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Institution Calendar</h1>
            <EventManager
                title="Events & Holidays"
                description="Manage institute-wide events, holidays, and important dates."
                canCreate={true}
                allowAllActions={true}
            />
        </div>
    );
};

export default AdminCalendar;
