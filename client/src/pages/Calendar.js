import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import Navbar from '../components/Navbar';
import './Calendar.css';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const handleMonthChange = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction));
    setSelectedDate(null);
  };

  const handleDateClick = (day) => {
    const clickedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(clickedDate);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          console.error('No user found in local storage.');
          setLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);

        // Fetch events by userId and engineerId
        const response = await axios.get(`/calendar`, {
          params: { userId: user.id, engineerId: user.id },
        });

        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching calendar events:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const eventsForSelectedDate = events.filter(
    (event) => event.date.startsWith(selectedDate)
  );

  const isDayWithEvent = (day) => {
    const dayString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.some((event) => event.date.startsWith(dayString));
  };

  return (
    <div className="calendar-container">
      <Navbar />
      <div className="calendar">
        <header className="calendar-header">
          <button className="nav-button" onClick={() => handleMonthChange(-1)}>{`<`}</button>
          <h2>
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <button className="nav-button" onClick={() => handleMonthChange(1)}>{`>`}</button>
        </header>
        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="calendar-day-header">
              {day}
            </div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="calendar-day empty"></div>
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => (
            <div
              key={index + 1}
              className={`calendar-day ${
                selectedDate === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(index + 1).padStart(2, '0')}`
                  ? 'selected'
                  : ''
              } ${isDayWithEvent(index + 1) ? 'has-event' : ''}`}
              onClick={() => handleDateClick(index + 1)}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
      <div className="event-list">
        <h3>{selectedDate || 'Select a date'}</h3>
        {loading ? (
          <p>Loading events...</p>
        ) : eventsForSelectedDate.length ? (
          eventsForSelectedDate.map((event, index) => (
            <div key={index} className="event-item">
              <div className="event-time">{event.hour}</div>
              <div className="event-title">{event.service}</div>
            </div>
          ))
        ) : (
          <p>No events for this day</p>
        )}
      </div>
    </div>
  );
};

export default Calendar;
