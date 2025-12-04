import React, { useState, useEffect } from 'react';
import { CalendarEvent, User } from '../types';
import { MockService } from '../services/mockService';
import { CalendarDays, Clock, MapPin, Plus, X, ChevronLeft, ChevronRight, Trash2, Edit2, Users } from 'lucide-react';

interface EventManagerProps {
  user?: User;
  allowAllActions?: boolean; // For admin
}

const EventManager: React.FC<EventManagerProps> = ({ user, allowAllActions = false }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'calendar' | 'events'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [form, setForm] = useState({
    title: '',
    description: '',
    eventDate: new Date().toISOString(),
    eventTime: '',
    course: 'All',
    department: 'All',
    year: 'All',
    semester: 'All',
    section: 'All',
    group: 'All',
    specificRollNumbers: ''
  });

  const canCreate = allowAllActions || (user?.role === 'faculty' || user?.role === 'admin');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const data = await MockService.getEvents();
    setEvents(data);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user && !allowAllActions) return;
    setSubmitting(true);

    const eventData: Partial<CalendarEvent> = {
      title: form.title,
      description: form.description,
      eventDate: form.eventDate,
      eventTime: form.eventTime,
      course: form.course,
      department: form.department,
      year: form.year,
      semester: form.semester,
      section: form.section,
      group: form.group,
      specificRollNumbers: form.specificRollNumbers ? form.specificRollNumbers.split(',').map(s => s.trim()) : [],
      createdBy: user?.id || 'admin',
      createdByName: user?.fullName || 'Admin'
    };

    if (editingId) {
      await MockService.updateEvent(editingId, eventData);
    } else {
      await MockService.createEvent(eventData as any);
    }

    setForm({
      title: '',
      description: '',
      eventDate: new Date().toISOString(),
      eventTime: '',
      course: 'All',
      department: 'All',
      year: 'All',
      semester: 'All',
      section: 'All',
      group: 'All',
      specificRollNumbers: ''
    });
    setEditingId(null);
    setShowForm(false);
    setSubmitting(false);
    loadEvents();
  };

  const handleEdit = (event: CalendarEvent) => {
    setForm({
      title: event.title,
      description: event.description || '',
      eventDate: event.eventDate,
      eventTime: event.eventTime || '',
      course: event.course || 'All',
      department: event.department || 'All',
      year: event.year || 'All',
      semester: event.semester || 'All',
      section: event.section || 'All',
      group: event.group || 'All',
      specificRollNumbers: event.specificRollNumbers ? event.specificRollNumbers.join(', ') : ''
    });
    setEditingId(event.id);
    setActiveView('events');
    setShowForm(true); // Ensure form is visible
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      title: '',
      description: '',
      eventDate: new Date().toISOString(),
      eventTime: '',
      course: 'All',
      department: 'All',
      year: 'All',
      semester: 'All',
      section: 'All',
      group: 'All',
      specificRollNumbers: ''
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await MockService.deleteEvent(id);
      loadEvents();
    }
  };

  // Calendar Logic
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + offset)));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const getHoliday = (date: Date) => {
    // Simple mock holidays
    const holidays: Record<string, string> = {
      '1-1': 'New Year',
      '26-1': 'Republic Day',
      '15-8': 'Independence Day',
      '2-10': 'Gandhi Jayanti',
      '25-12': 'Christmas'
    };
    const key = `${date.getDate()}-${date.getMonth() + 1}`;
    return holidays[key] ? { name: holidays[key] } : null;
  };

  const getDateEvents = (date: Date) => {
    return events.filter(e => {
      const eDate = new Date(e.eventDate);
      return eDate.getDate() === date.getDate() &&
        eDate.getMonth() === date.getMonth() &&
        eDate.getFullYear() === date.getFullYear();
    });
  };

  const renderCalendarMatrix = () => {
    const { days, firstDay } = getDaysInMonth(currentMonth);
    const matrix: { date: Date | null, events: CalendarEvent[] }[][] = [];
    let week: { date: Date | null, events: CalendarEvent[] }[] = [];

    // Fill previous month empty slots
    for (let i = 0; i < firstDay; i++) {
      week.push({ date: null, events: [] });
    }

    for (let d = 1; d <= days; d++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
      const dayEvents = getDateEvents(date);
      week.push({ date, events: dayEvents });

      if (week.length === 7) {
        matrix.push(week);
        week = [];
      }
    }

    // Fill remaining slots
    if (week.length > 0) {
      while (week.length < 7) {
        week.push({ date: null, events: [] });
      }
      matrix.push(week);
    }

    return matrix;
  };

  const calendarMatrix = renderCalendarMatrix();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-blue-600" />
            Academic Calendar & Events
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage and view college events.</p>
        </div>
        <div className="flex items-center gap-3">
          {canCreate && (
            <button
              onClick={() => {
                setEditingId(null);
                setForm({
                  title: '',
                  description: '',
                  eventDate: new Date().toISOString(),
                  eventTime: '',
                  course: 'All',
                  department: 'All',
                  year: 'All',
                  semester: 'All',
                  section: 'All',
                  group: 'All',
                  specificRollNumbers: ''
                });
                setActiveView('events');
                setShowForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          )}
          <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveView('calendar')}
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center space-x-2 ${activeView === 'calendar' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Calendar</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveView('events'); setShowForm(false); }}
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center space-x-2 ${activeView === 'events' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
            >
              <Users className="w-4 h-4" />
              <span>List View</span>
            </button>
          </div>
        </div>
      </div>

      {canCreate && activeView === 'events' && showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-slate-700">{editingId ? 'Edit Event' : 'Add New Event'}</h3>
            <button type="button" onClick={() => { setShowForm(false); handleCancelEdit(); }} className="text-sm text-slate-500 hover:text-slate-700">
              Cancel
            </button>
          </div>
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
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Course</label>
                <select
                  value={form.course}
                  onChange={e => setForm(prev => ({ ...prev, course: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Courses</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="BCA">BCA</option>
                  <option value="BBA">BBA</option>
                  <option value="MCA">MCA</option>
                  <option value="MBA">MBA</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Department</label>
                <select
                  value={form.department}
                  onChange={e => setForm(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Depts</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                  <option value="Civil">Civil</option>
                  <option value="EE">EE</option>
                  <option value="CE">CE</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Year</label>
                <select
                  value={form.year}
                  onChange={e => setForm(prev => ({ ...prev, year: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Years</option>
                  <option value="1st">1st</option>
                  <option value="2nd">2nd</option>
                  <option value="3rd">3rd</option>
                  <option value="4th">4th</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Semester</label>
                <select
                  value={form.semester}
                  onChange={e => setForm(prev => ({ ...prev, semester: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Semesters</option>
                  <option value="Sem 1">Sem 1</option>
                  <option value="Sem 2">Sem 2</option>
                  <option value="Sem 3">Sem 3</option>
                  <option value="Sem 4">Sem 4</option>
                  <option value="Sem 5">Sem 5</option>
                  <option value="Sem 6">Sem 6</option>
                  <option value="Sem 7">Sem 7</option>
                  <option value="Sem 8">Sem 8</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Section</label>
                <select
                  value={form.section}
                  onChange={e => setForm(prev => ({ ...prev, section: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Sections</option>
                  <option value="Section A">Section A</option>
                  <option value="Section B">Section B</option>
                  <option value="Section C">Section C</option>
                  <option value="Section D">Section D</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Group</label>
                <select
                  value={form.group}
                  onChange={e => setForm(prev => ({ ...prev, group: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Groups</option>
                  <option value="Group 1">Group 1</option>
                  <option value="Group 2">Group 2</option>
                  <option value="Group 3">Group 3</option>
                  <option value="Group 4">Group 4</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Specific Roll Numbers</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={form.specificRollNumbers}
                  onChange={e => setForm(prev => ({ ...prev, specificRollNumbers: e.target.value }))}
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter roll numbers separated by comma (e.g. 1901001, 1901002)"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">* Leave filters empty to send to everyone.</p>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
            >
              {submitting ? 'Saving...' : (editingId ? 'Update Event' : 'Add Event')}
            </button>
          </div>
        </form>
      )}

      {activeView === 'events' && (
        <div className="space-y-8">
          {/* Upcoming Events */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-blue-600" />
                Upcoming Events
              </h3>
            </div>
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading events...</div>
            ) : events.filter(e => new Date(e.eventDate) >= new Date(new Date().setHours(0, 0, 0, 0))).length === 0 ? (
              <div className="p-8 text-center text-slate-500">No upcoming events scheduled.</div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {events
                  .filter(e => new Date(e.eventDate) >= new Date(new Date().setHours(0, 0, 0, 0)))
                  .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
                  .map(event => {
                    const canManage = allowAllActions || (user && event.createdBy === user.id);
                    return (
                      <li
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
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
                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{event.description || 'No description provided.'}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                              {new Date(event.eventDate).toLocaleDateString()}
                              {event.eventTime && ` at ${event.eventTime}`}
                            </p>
                          </div>
                        </div>
                        {canManage && (
                          <div className="flex items-center space-x-2 self-start md:self-auto" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => handleEdit(event)}
                              className="flex items-center text-blue-600 text-sm font-medium hover:text-blue-700"
                            >
                              <Edit2 className="w-4 h-4 mr-1" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(event.id)}
                              className="flex items-center text-red-600 text-sm font-medium hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-1" /> Delete
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>

          {/* Past Events */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden opacity-80">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-600 flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" />
                Past Events
              </h3>
            </div>
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading events...</div>
            ) : events.filter(e => new Date(e.eventDate) < new Date(new Date().setHours(0, 0, 0, 0))).length === 0 ? (
              <div className="p-8 text-center text-slate-500">No past events.</div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {events
                  .filter(e => new Date(e.eventDate) < new Date(new Date().setHours(0, 0, 0, 0)))
                  .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
                  .map(event => {
                    const canManage = allowAllActions || (user && event.createdBy === user.id);
                    return (
                      <li
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:bg-slate-50 cursor-pointer transition-colors grayscale-[0.3]"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 rounded-lg bg-slate-100 text-slate-500 flex flex-col items-center justify-center text-xs font-semibold">
                            <span>{new Date(event.eventDate).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                            <span className="text-lg">{new Date(event.eventDate).getDate()}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-700 dark:text-white flex items-center space-x-2">
                              <CalendarDays className="w-4 h-4 text-slate-400" />
                              <span>{event.title}</span>
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{event.description || 'No description provided.'}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                              {new Date(event.eventDate).toLocaleDateString()}
                              {event.eventTime && ` at ${event.eventTime}`}
                            </p>
                          </div>
                        </div>
                        {canManage && (
                          <div className="flex items-center space-x-2 self-start md:self-auto" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => handleEdit(event)}
                              className="flex items-center text-blue-600 text-sm font-medium hover:text-blue-700"
                            >
                              <Edit2 className="w-4 h-4 mr-1" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(event.id)}
                              className="flex items-center text-red-600 text-sm font-medium hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-1" /> Delete
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>
        </div>
      )}

      {activeView === 'calendar' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden max-w-5xl mx-auto">
          {/* ... (existing calendar header) ... */}
          <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex space-x-2">
              <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              <button onClick={() => setCurrentMonth(new Date())} className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300">
                Today
              </button>
              <button onClick={() => changeMonth(1)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 text-center border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 bg-slate-200 dark:bg-slate-700 gap-px">
            {calendarMatrix.map((week, idx) => (
              week.map(({ date, events: dayEvents }, dayIdx) => {
                const isCurrentMonth = date && date.getMonth() === currentMonth.getMonth();
                const isTodayDate = date && isToday(date);
                const holiday = date ? getHoliday(date) : null;
                const isWeekend = date ? (date.getDay() === 0 || date.getDay() === 6) : false;

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
                      min-h-[100px] p-2 text-left transition-all relative group
                      ${bgClass}
                      ${date ? 'hover:brightness-95 dark:hover:brightness-110' : 'bg-slate-50 dark:bg-slate-800/50'}
                    `}
                  >
                    {date && (
                      <>
                        <div className="flex justify-between items-start mb-1">
                          <span className={`
                            flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium
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
                            <div className="flex items-center px-1 py-0.5 rounded bg-red-100 dark:bg-red-900/30 border-l-2 border-red-500 truncate">
                              <span className="text-[9px] font-medium text-red-700 dark:text-red-300 truncate" title={holiday.name}>
                                {holiday.name}
                              </span>
                            </div>
                          )}
                          {dayEvents.slice(0, holiday ? 1 : 2).map(ev => (
                            <div key={ev.id} className="flex items-center px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 border-l-2 border-blue-500 truncate">
                              <span className="text-[9px] font-medium text-blue-700 dark:text-blue-300 truncate">
                                {ev.title}
                              </span>
                            </div>
                          ))}
                          {dayEvents.length > (holiday ? 1 : 2) && (
                            <div className="text-[9px] text-slate-400 dark:text-slate-500 pl-1">
                              +{dayEvents.length - (holiday ? 1 : 2)} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </button>
                );
              })
            ))}
          </div>
        </div>
      )}

      {/* Day View Modal */}
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
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {getHoliday(selectedDate) && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/50">
                  <p className="font-semibold text-red-800 dark:text-red-300">🎉 Holiday: {getHoliday(selectedDate)?.name}</p>
                </div>
              )}
              {getDateEvents(selectedDate).length === 0 && !getHoliday(selectedDate) ? (
                <p className="text-slate-500 dark:text-slate-400">No events scheduled for this date.</p>
              ) : (
                getDateEvents(selectedDate).map(event => (
                  <div
                    key={event.id}
                    onClick={() => { setSelectedDate(null); setSelectedEvent(event); }}
                    className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer transition-colors"
                  >
                    <p className="font-semibold text-slate-800 dark:text-white">{event.title}</p>
                    {event.eventTime && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center space-x-1 mt-1">
                        <Clock className="w-4 h-4" />
                        <span>{event.eventTime}</span>
                      </p>
                    )}
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{event.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedEvent.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Created by {selectedEvent.createdByName}
                </p>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg text-blue-700 dark:text-blue-300">
                  <CalendarDays className="w-4 h-4" />
                  <span className="font-medium">{new Date(selectedEvent.eventDate).toLocaleDateString('default', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                {selectedEvent.eventTime && (
                  <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{selectedEvent.eventTime}</span>
                  </div>
                )}
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide mb-2">Description</h4>
                <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                  {selectedEvent.description || 'No description provided.'}
                </p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide mb-3">Target Audience</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Course', value: selectedEvent.course },
                    { label: 'Dept', value: selectedEvent.department },
                    { label: 'Year', value: selectedEvent.year },
                    { label: 'Sem', value: selectedEvent.semester },
                    { label: 'Section', value: selectedEvent.section },
                    { label: 'Group', value: selectedEvent.group }
                  ].map((item, idx) => (
                    item.value && item.value !== 'All' && (
                      <span key={idx} className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                        {item.label}: {item.value}
                      </span>
                    )
                  ))}
                  {(!selectedEvent.course || selectedEvent.course === 'All') &&
                    (!selectedEvent.department || selectedEvent.department === 'All') &&
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                      Open to All
                    </span>
                  }
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManager;
