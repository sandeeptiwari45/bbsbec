
import React, { useEffect, useState } from 'react';
import { CalendarEvent } from '../types';
import { MockService } from '../services/mockService';
import { CalendarDays, Trash2, Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface EventManagerProps {
  title?: string;
  description?: string;
  canCreate?: boolean;
  allowAllActions?: boolean;
  className?: string;
}

const HOLIDAYS_2025 = [
  { date: "2025-01-06", name: "Parkash Gurpurab of Sri Guru Gobind Singh Ji" },
  { date: "2025-01-26", name: "Republic Day" },
  { date: "2025-02-12", name: "Birthday of Sri Guru Ravidas Ji" },
  { date: "2025-02-26", name: "Maha Shivratri" },
  { date: "2025-03-14", name: "Holi" },
  { date: "2025-03-23", name: "Shaheedi Diwas of Bhagat Singh, Sukhdev & Rajguru" },
  { date: "2025-03-31", name: "Idul’Fit’r" },
  { date: "2025-04-06", name: "Ram Navami" },
  { date: "2025-04-08", name: "Birthday of Sri Guru Nabha Dass Ji" },
  { date: "2025-04-13", name: "Mahavir Jayanti" },
  { date: "2025-04-14", name: "Vaisakhi; Birthday of Dr. B. R. Ambedkar" },
  { date: "2025-04-18", name: "Good Friday" },
  { date: "2025-04-29", name: "Lord Parshuram Jayanti" },
  { date: "2025-05-01", name: "May Day" },
  { date: "2025-05-30", name: "Martyrdom Day of Sri Guru Arjan Dev Ji" },
  { date: "2025-06-07", name: "Id-ul-Zuha (Bakrid)" },
  { date: "2025-06-11", name: "Bhagat Kabir Jayanti" },
  { date: "2025-08-15", name: "Independence Day" },
  { date: "2025-08-16", name: "Janmashtami" },
  { date: "2025-09-22", name: "Maharaj Agrasain Jayanti" },
  { date: "2025-10-02", name: "Birthday of Mahatma Gandhi Ji" },
  { date: "2025-10-07", name: "Dussehra" },
  { date: "2025-10-20", name: "Diwali" },
  { date: "2025-10-22", name: "Birthday of Maharishi Valmiki Ji; Vishwakarma Day" },
  { date: "2025-11-05", name: "Parkash Gurpurab of Sri Guru Nanak Dev Ji" },
  { date: "2025-11-16", name: "Martyrdom Day of S. Kartar Singh Sarabha Ji" },
  { date: "2025-11-25", name: "Martyrdom Day of Sri Guru Teg Bahadur Ji" },
  { date: "2025-12-25", name: "Christmas Day" }
];

const EventManager: React.FC<EventManagerProps> = ({
  title = 'Events Calendar',
  description,
  canCreate = false,
  allowAllActions = false,
  className,
}) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', description: '', eventDate: '', eventTime: '' });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeView, setActiveView] = useState<'events' | 'calendar'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const loadEvents = async () => {
    setLoading(true);
    const list = await MockService.getEvents();
    setEvents(list);
    setLoading(false);
  };

  const eventsInMonth = events.filter(ev => {
    const date = new Date(ev.eventDate);
    return date.getFullYear() === currentMonth.getFullYear() && date.getMonth() === currentMonth.getMonth();
  });

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getHoliday = (date: Date) => {
    // Adjust for timezone offset to compare correctly with YYYY-MM-DD strings
    // Or simpler: just match the date parts
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    return HOLIDAYS_2025.find(h => h.date === dateString);
  };

  const getDateEvents = (date: Date) => {
    return events.filter(ev => {
      const evDate = new Date(ev.eventDate);
      return evDate.toDateString() === date.toDateString();
    });
  };

  const buildCalendar = () => {
    const startDay = new Date(currentMonth);
    const firstWeekday = startDay.getDay(); // 0-6
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const cells: Array<{ date: Date | null; events: CalendarEvent[] }> = [];

    for (let i = 0; i < firstWeekday; i++) {
      cells.push({ date: null, events: [] });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dayEvents = eventsInMonth.filter(ev => new Date(ev.eventDate).getDate() === day);
      cells.push({ date, events: dayEvents });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ date: null, events: [] });
    }
    const weeks: (typeof cells)[] = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }
    return weeks;
  };

  const calendarMatrix = buildCalendar();

  const changeMonth = (delta: number) => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.title || !form.eventDate) return;
    setSubmitting(true);
    await MockService.createEvent({
      title: form.title,
      description: form.description,
      eventDate: form.eventDate,
      eventTime: form.eventTime,
      createdBy: user.id,
      createdByName: user.fullName,
    });
    setForm({ title: '', description: '', eventDate: '', eventTime: '' });
    setSubmitting(false);
    loadEvents();
  };

  const handleDelete = async (eventId: string) => {
    const event = events.find(ev => ev.id === eventId);
    if (!event) return;
    const canDelete = allowAllActions || (user && event.createdBy === user.id);
    if (!canDelete) return;
    if (confirm('Delete this event?')) {
      await MockService.deleteEvent(eventId);
      loadEvents();
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
            {description && <p className="text-sm text-slate-500">{description}</p>}
          </div>
          <span className="text-sm text-slate-500">{events.length} items scheduled</span>
        </div>
        <div className="inline-flex bg-slate-100 rounded-lg p-1 w-max">
          <button
            type="button"
            onClick={() => setActiveView('calendar')}
            className={`px-4 py-2 text-sm font-medium rounded-md flex items-center space-x-2 ${activeView === 'calendar' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Calendar</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('events')}
            className={`px-4 py-2 text-sm font-medium rounded-md flex items-center space-x-2 ${activeView === 'events' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Events</span>
          </button>
        </div>
      </div>

      {canCreate && activeView === 'events' && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6 space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Event Title</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Guest Lecture"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Extra details for staff and students"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Event Date</label>
                <input
                  type="date"
                  required
                  value={form.eventDate ? form.eventDate.substring(0, 10) : ''}
                  onChange={e => setForm(prev => ({ ...prev, eventDate: new Date(e.target.value).toISOString() }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Event Time</label>
                <input
                  type="time"
                  value={form.eventTime}
                  onChange={e => setForm(prev => ({ ...prev, eventTime: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
            >
              {submitting ? 'Saving...' : 'Add Event'}
            </button>
          </div>
        </form>
      )}

      {activeView === 'events' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No events scheduled yet.</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {events.map(event => {
                const canManage = allowAllActions || (user && event.createdBy === user.id);
                return (
                  <li key={event.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:bg-slate-50">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-lg bg-blue-50 text-blue-600 flex flex-col items-center justify-center text-xs font-semibold">
                        <span>{new Date(event.eventDate).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                        <span className="text-lg">{new Date(event.eventDate).getDate()}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white flex items-center space-x-2">
                          <CalendarDays className="w-4 h-4 text-slate-400" />
                          <span>{event.title}</span>
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{event.description || 'No description provided.'}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          {new Date(event.eventDate).toLocaleDateString()}
                          {event.eventTime && ` at ${event.eventTime}`}
                          {' • '}Created by {event.createdByName}
                        </p>
                      </div>
                    </div>
                    {canManage && (
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="flex items-center text-red-600 text-sm font-medium hover:text-red-700 self-start md:self-auto"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {activeView === 'calendar' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-2xl font-bold text-slate-800 dark:text-white capitalize">
              {currentMonth.toLocaleString('default', { month: 'long' })} <span className="text-slate-400 dark:text-slate-500 font-normal">{currentMonth.getFullYear()}</span>
            </h3>

            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              Today
            </button>
          </div>

          <div className="grid grid-cols-7 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            {calendarMatrix.map((week, idx) => (
              week.map(({ date, events: dayEvents }, dayIdx) => {
                const isCurrentMonth = date && date.getMonth() === currentMonth.getMonth();
                const isTodayDate = date && isToday(date);
                const holiday = date ? getHoliday(date) : null;
                const isWeekend = date ? (date.getDay() === 0 || date.getDay() === 6) : false;

                // Determine background color
                let bgClass = 'bg-white dark:bg-slate-800';
                if (date) {
                  if (isTodayDate) bgClass = 'bg-blue-50 dark:bg-blue-900/20';
                  else if (holiday) bgClass = 'bg-red-50 dark:bg-red-900/20';
                  else if (isWeekend) bgClass = 'bg-slate-100 dark:bg-slate-700/30';
                }
                if (!isCurrentMonth && date) bgClass += ' opacity-50';

                return (
                  <button
                    key={`${idx}-${dayIdx}`}
                    onClick={() => date && setSelectedDate(date)}
                    disabled={!date}
                    className={`
                    min-h-[120px] p-2 text-left transition-all relative group
                    ${bgClass}
                    ${date ? 'hover:brightness-95 dark:hover:brightness-110' : 'bg-slate-50 dark:bg-slate-800/50'}
                  `}
                  >
                    {date && (
                      <>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`
                            flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium
                            ${isTodayDate
                              ? 'bg-blue-600 text-white shadow-md'
                              : holiday
                                ? 'text-red-600 dark:text-red-400 font-bold'
                                : 'text-slate-700 dark:text-slate-300'}
                        `}>
                            {date.getDate()}
                          </span>
                          {dayEvents.length > 0 && (
                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded-full">
                              {dayEvents.length}
                            </span>
                          )}
                        </div>

                        <div className="space-y-1">
                          {holiday && (
                            <div className="flex items-center px-1.5 py-1 rounded bg-red-100 dark:bg-red-900/30 border-l-2 border-red-500 truncate">
                              <span className="text-[10px] font-medium text-red-700 dark:text-red-300 truncate" title={holiday.name}>
                                {holiday.name}
                              </span>
                            </div>
                          )}
                          {dayEvents.slice(0, holiday ? 2 : 3).map(ev => (
                            <div key={ev.id} className="flex items-center px-1.5 py-1 rounded bg-blue-100 dark:bg-blue-900/30 border-l-2 border-blue-500 truncate">
                              <span className="text-[10px] font-medium text-blue-700 dark:text-blue-300 truncate">
                                {ev.title}
                              </span>
                            </div>
                          ))}
                          {dayEvents.length > (holiday ? 2 : 3) && (
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 pl-1">
                              +{dayEvents.length - (holiday ? 2 : 3)} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </button>
                )
              })
            ))}
          </div>
        </div>
      )}

      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedDate(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                {selectedDate.toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h3>
              <button onClick={() => setSelectedDate(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              {getHoliday(selectedDate) && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/50">
                  <p className="font-semibold text-red-800 dark:text-red-300">🎉 Holiday: {getHoliday(selectedDate)?.name}</p>
                </div>
              )}
              {getDateEvents(selectedDate).length === 0 && !getHoliday(selectedDate) ? (
                <p className="text-slate-500 dark:text-slate-400">No events scheduled for this date.</p>
              ) : (
                getDateEvents(selectedDate).map(event => (
                  <div key={event.id} className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <p className="font-semibold text-slate-800 dark:text-white">{event.title}</p>
                    {event.eventTime && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center space-x-1 mt-1">
                        <Clock className="w-4 h-4" />
                        <span>{event.eventTime}</span>
                      </p>
                    )}
                    {event.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{event.description}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManager;
