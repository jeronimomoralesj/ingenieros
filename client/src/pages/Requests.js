import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);

          const response = await axios.get(`/engineers/profile/${user.id}`);
          setRequests(response.data.requests || []);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAcceptRequest = async (request) => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        alert('Usuario no autenticado.');
        return;
      }

      const currentUser = JSON.parse(storedUser);

      // Decode the request message to extract date and time
      const match = request.message.match(/Reserva para (\d{4}-\d{2}-\d{2}) a las (\d{2}:\d{2}) - (\d{2}:\d{2})/);
      if (!match) {
        alert('El mensaje de la solicitud no tiene un formato válido.');
        return;
      }

      const [_, date, startTime, endTime] = match;

      // Prepare data to push to the calendar
      const calendarEntry = {
        date: new Date(date),
        hour: `${startTime} - ${endTime}`,
        service: request.service, // Static service for now
        engineerId: currentUser.id, // Logged-in user's ID as engineerId
        userId: request.requester, // Requester's userId
      };

      console.log('Calendar entry:', calendarEntry);

      // Add the booking to the calendar
      await axios.post('/calendar', calendarEntry);

      // Remove the request from the backend
      await axios.delete(`/engineers/request/${currentUser.id}`, {
        data: {
          requester: request.requester,
          message: request.message,
        },
      });

      alert(`Solicitud aceptada y reservada para ${date} a las ${startTime} - ${endTime}.`);

      // Remove the request from the local state
      setRequests((prevRequests) => prevRequests.filter((r) => r !== request));
    } catch (error) {
      console.error('Error processing request:', error.response?.data || error.message);
      alert('Hubo un error al procesar la solicitud.');
    }
  };

  return (
    <div className="requests-container">
      <h1>Solicitudes de Reserva</h1>
      {loading ? (
        <p>Cargando solicitudes...</p>
      ) : requests.length === 0 ? (
        <p>No tienes solicitudes de reserva.</p>
      ) : (
        <div className="requests-list">
          {requests.map((request, index) => (
            <div key={index} className="request-card">
              <p>
                <strong>Solicitante:</strong> {request.requester}
              </p>

              <p>
                <strong>Servicio:</strong> {request.service}
              </p>

              <p>
                <strong>Mensaje:</strong> {request.message}
              </p>
              <button
                className="accept-request-button"
                onClick={() => handleAcceptRequest(request)}
              >
                Aceptar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;
