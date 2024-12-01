import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import './Book.css';

const Book = ({ engineer, closePopup }) => {
  const [workHours, setWorkHours] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const storedUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchWorkHours = async () => {
      try {
        const response = await axios.get(`/engineers/profile/${engineer.userId}`);
        setWorkHours(response.data.workHours || {});
        if (response.data.servicios.length === 1) {
          setSelectedService(response.data.servicios[0].service);
        }
      } catch (error) {
        console.error('Error fetching work hours:', error);
      }
    };

    fetchWorkHours();
    generateCalendar(currentMonth);
  }, [engineer.userId, currentMonth]);

  const generateCalendar = (month) => {
    const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const days = [];
    for (let day = 1; day <= endDate.getDate(); day++) {
      days.push(new Date(month.getFullYear(), month.getMonth(), day));
    }
    setCalendarDays(days);
  };

  const isDayAvailable = (date) => {
    const dayKey = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
      date.getDay()
    ];
    return workHours[dayKey] && workHours[dayKey].length > 0;
  };

  const getAvailableTimeIntervals = (start, end) => {
    const intervals = [];
    const startTime = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);

    while (startTime < endTime) {
      const nextTime = new Date(startTime.getTime() + 20 * 60 * 1000); // Add 20 minutes
      intervals.push({
        start: startTime.toTimeString().slice(0, 5),
        end: nextTime.toTimeString().slice(0, 5),
      });
      startTime.setTime(nextTime.getTime());
    }

    return intervals;
  };

  const getAvailableTimesForDay = (date) => {
    const dayKey = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
      date.getDay()
    ];
    const timeRanges = workHours[dayKey] || [];
    const intervals = timeRanges.flatMap((range) =>
      getAvailableTimeIntervals(range.start, range.end)
    );
    return intervals;
  };

  const handleDateClick = (date) => {
    if (isDayAvailable(date)) {
      setSelectedDate(date);
      const times = getAvailableTimesForDay(date);
      setAvailableTimes(times);
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleConfirmBooking = async () => {
    if (selectedDate && selectedTime && selectedService) {
      const booking = {
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        userId: storedUser.id,
        engineerId: engineer.userId,
        service: selectedService, // Include selected service
      };
  
      try {
        await axios.post('/engineers/requests', booking);
        alert(
          `Reserva confirmada para ${booking.date} a las ${booking.time} para el servicio "${booking.service}".`
        );
        closePopup();
      } catch (error) {
        console.error('Error confirming booking:', error);
        alert('Hubo un problema al procesar tu reserva.');
      }
    } else {
      alert('Por favor, selecciona una fecha, horario y servicio.');
    }
  };
  

  return (
    <div className="book-container">
      <button className="close-popup" onClick={closePopup}>
        ✕
      </button>
      <h2>Agendar con {engineer.name}</h2>
      <div className="service-selection">
        <label htmlFor="service-select">Selecciona un servicio:</label>
        <select
          id="service-select"
          value={selectedService}
          onChange={handleServiceChange}
          disabled={engineer.servicios.length === 1}
        >
          {engineer.servicios.map((service, index) => (
            <option key={index} value={service.service}>
              {service.service}
            </option>
          ))}
        </select>
      </div>
      <div className="calendar-navigation">
        <button onClick={goToPreviousMonth}>⟵ Mes Anterior</button>
        <h3>
          {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
        </h3>
        <button onClick={goToNextMonth}>Mes Siguiente ⟶</button>
      </div>
      <div className="calendar-grid">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
          <div key={day} className="calendar-header">
            {day}
          </div>
        ))}
        {calendarDays.map((date) => (
          <div
            key={date.toISOString()}
            className={`calendar-day ${
              isDayAvailable(date) ? 'available' : 'unavailable'
            } ${selectedDate && date.toDateString() === selectedDate.toDateString() ? 'selected' : ''}`}
            onClick={() => handleDateClick(date)}
          >
            <span className="day-number">{date.getDate()}</span>
          </div>
        ))}
      </div>

      {selectedDate && (
        <div className="time-selection">
          <h3>
            Selecciona un horario para el día{' '}
            {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h3>
          <div className="time-options">
            {availableTimes.map((time, index) => (
              <button
                key={index}
                className={`time-button ${
                  selectedTime === `${time.start} - ${time.end}` ? 'selected-time' : ''
                }`}
                onClick={() => handleTimeSelect(`${time.start} - ${time.end}`)}
              >
                {time.start} - {time.end}
              </button>
            ))}
          </div>
          <button className="confirm-booking-button" onClick={handleConfirmBooking}>
            Confirmar Reserva
          </button>
        </div>
      )}
    </div>
  );
};

export default Book;
