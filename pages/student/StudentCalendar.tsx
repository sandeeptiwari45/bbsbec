import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MockService } from '../../services/mockService';
import { Notice } from '../../types';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';

const StudentCalendar: React.FC = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (user) {
      MockService.getNotices(user).then(data => {
        setNotices(data.filter(n => n.eventDate)); // Only show notices with event dates
      });
    }
  }, [user]);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getEventsForDay = (day: number) => {
    const d = new Date(year, month, day);
    return notices.filter(n => {
        const nDate = new Date(n.eventDate!);
        return nDate.getDate() === day && nDate.getMonth() === month && nDate.getFullYear() === year;
    });
  };

  const selectedEvents = selectedDate ? notices.filter(n => {
      const nDate = new Date(n.eventDate!);
      return nDate.getDate() === selectedDate.getDate() && 
             nDate.getMonth() === selectedDate.getMonth() && 
             nDate.getFullYear() === selectedDate.getFullYear();
  }) : [];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Calendar Grid */}
      <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex space-x-2">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-full"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-full"><ChevronRight className="w-5 h-5" /></button>
            </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-slate-500 mb-2">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>

        <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => {
                if (!day) return <div key={idx} className="h-14 md:h-24"></div>;
                const events = getEventsForDay(day);
                const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === month;

                return (
                    <div 
                        key={idx} 
                        onClick={() => setSelectedDate(new Date(year, month, day))}
                        className={`h-14 md:h-24 border rounded-lg p-1 relative cursor-pointer transition-colors ${
                            isSelected ? 'ring-2 ring-blue-500 border-transparent bg-blue-50' : 
                            isToday ? 'bg-blue-50 border-blue-200' : 'border-slate-100 hover:bg-slate-50'
                        }`}
                    >
                        <span className={`text-sm ${isToday ? 'font-bold text-blue-600' : 'text-slate-700'}`}>{day}</span>
                        <div className="mt-1 space-y-1">
                            {events.slice(0, 3).map((e, i) => (
                                <div key={i} className={`h-1.5 rounded-full w-full ${
                                    e.category === 'Exam' ? 'bg-red-400' : 
                                    e.category === 'Holiday' ? 'bg-green-400' : 'bg-blue-400'
                                }`}></div>
                            ))}
                            {events.length > 3 && <div className="text-[10px] text-slate-400 leading-none text-center">+ {events.length - 3}</div>}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Selected Events Side Panel */}
      <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
        <h3 className="text-lg font-bold text-slate-800 mb-4">
            {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Upcoming Events'}
        </h3>
        
        <div className="space-y-4">
            {(selectedDate ? selectedEvents : notices.slice(0, 5)).map(notice => (
                <div key={notice.id} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <Circle className={`w-3 h-3 mt-1.5 flex-shrink-0 ${
                        notice.category === 'Exam' ? 'text-red-500 fill-red-500' : 
                        notice.category === 'Holiday' ? 'text-green-500 fill-green-500' : 'text-blue-500 fill-blue-500'
                    }`} />
                    <div>
                        <h4 className="text-sm font-semibold text-slate-800">{notice.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notice.description}</p>
                        <span className="text-[10px] uppercase font-bold text-slate-400 mt-2 block">{notice.category}</span>
                    </div>
                </div>
            ))}
            {notices.length === 0 && <p className="text-slate-500 text-sm">No events scheduled.</p>}
        </div>
      </div>
    </div>
  );
};

export default StudentCalendar;
