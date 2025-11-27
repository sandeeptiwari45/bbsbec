import React, { useEffect, useState } from 'react';
import { CalendarEvent } from '../types';
import { MockService } from '../services/mockService';
import { CalendarDays, Trash2, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface EventManagerProps {
  title?: string;
  description?: string;
  canCreate?: boolean;
  allowAllActions?: boolean;
  className?: string;
}

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
  const [form, setForm] = useState({ title: '', description: '', eventDate: '' });
  const [submitting, setSubmitting] = useState(false);
  const [activeView, setActiveView] = useState<'events' | 'calendar'>('events');
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
    const weeks: typeof cells[][] = [];
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
      createdBy: user.id,
      createdByName: user.fullName,
    });
    setForm({ title: '', description: '', eventDate: '' });
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
            onClick={() => setActiveView('events')}
            className={`px-4 py-2 text-sm font-medium rounded-md flex items-center space-x-2 ${activeView === 'events' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Events</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('calendar')}
            className={`px-4 py-2 text-sm font-medium rounded-md flex items-center space-x-2 ${activeView === 'calendar' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Calendar</span>
          </button>
        </div>
      </div>

      {canCreate && activeView === 'events' && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
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
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Event Date</label>
              <input
                type="date"
                required
                value={form.eventDate ? form.eventDate.substring(0, 10) : ''}
                onChange={e => setForm(prev => ({ ...prev, eventDate: new Date(e.target.value).toISOString() }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
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
                        <p className="font-semibold text-slate-800 flex items-center space-x-2">
                          <CalendarDays className="w-4 h-4 text-slate-400" />
                          <span>{event.title}</span>
                        </p>
                        <p className="text-sm text-slate-500">{event.description || 'No description provided.'}</p>
                        <p className="text-xs text-slate-400 mt-1">Created by {event.createdByName}</p>
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-center">
              <p className="text-lg font-semibold text-slate-800">
                {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
              </p>
              <p className="text-sm text-slate-500">{eventsInMonth.length} events</p>
            </div>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-500 mb-2">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => (
              <div key={day} className="py-1">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 text-sm">
            {calendarMatrix.map((week, idx) => (
              week.map(({ date, events: dayEvents }, dayIdx) => (
                <div
                  key={`${idx}-${dayIdx}`}
                  className={`min-h-[80px] rounded-lg border ${date ? 'border-slate-200 bg-slate-50' : 'border-transparent'}`}
                >
                  {date && (
                    <div className="flex flex-col h-full p-2">
                      <span className="text-xs font-semibold text-slate-600">{date.getDate()}</span>
                      <div className="mt-1 space-y-1">
                        {dayEvents.slice(0, 3).map(ev => (
                          <span key={ev.id} className="block text-[10px] truncate rounded bg-blue-100 text-blue-700 px-1 py-0.5">
                            {ev.title}
                          </span>
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-[10px] text-slate-500">+{dayEvents.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManager;

