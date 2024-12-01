import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { FaTrashAlt, FaPlus } from 'react-icons/fa';
import './Account.css';
import Navbar from '../components/Navbar';

const Account = () => {
  const [user, setUser] = useState(null); // Holds user info from localStorage
  const [engineerData, setEngineerData] = useState(null); // Holds engineer profile data
  const [formVisible, setFormVisible] = useState(false); // Controls form visibility
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    sobreMi: '',
    ingeniero: '',
    estudios: [{ institution: '', degree: '' }],
    servicios: [{ service: '', cost: '' }],
    imageUrl: '',
    workHours: {}, // Object containing day and time ranges
  });

  const daysOfWeek = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          if (parsedUser.role === 'engineer') {
            // Fetch engineer profile
            const response = await axios.get(`/engineers/profile/${parsedUser.id}`);
            setEngineerData(response.data);

            // Prepopulate form data
            const prefilledWorkHours = Object.keys(response.data.workHours || {}).reduce(
              (acc, day) => ({
                ...acc,
                [day]: response.data.workHours[day].map(({ start, end }) => ({ start, end })),
              }),
              {}
            );

            setFormData({
              name: response.data.name,
              city: response.data.city,
              sobreMi: response.data.sobreMi,
              ingeniero: response.data.ingeniero,
              estudios: response.data.estudios.length > 0 ? response.data.estudios : [{ institution: '', degree: '' }],
              servicios: response.data.servicios.length > 0 ? response.data.servicios : [{ service: '', cost: '' }],
              imageUrl: response.data.imageUrl || '',
              workHours: prefilledWorkHours,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user or engineer profile:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWorkHoursChange = (day, index, key, value) => {
    setFormData((prev) => {
      const updatedDayHours = [...(prev.workHours[day] || [])];
      updatedDayHours[index] = { ...updatedDayHours[index], [key]: value };

      return {
        ...prev,
        workHours: { ...prev.workHours, [day]: updatedDayHours },
      };
    });
  };

  const handleAddWorkHour = (day) => {
    setFormData((prev) => ({
      ...prev,
      workHours: {
        ...prev.workHours,
        [day]: [...(prev.workHours[day] || []), { start: '', end: '' }],
      },
    }));
  };

  const handleRemoveWorkHour = (day, index) => {
    setFormData((prev) => ({
      ...prev,
      workHours: {
        ...prev.workHours,
        [day]: (prev.workHours[day] || []).filter((_, i) => i !== index),
      },
    }));
  };

  const handleAddField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], field === 'estudios' ? { institution: '', degree: '' } : { service: '', cost: '' }],
    }));
  };

  const handleRemoveField = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/engineers/profile', formData);
      setEngineerData(response.data.engineer);
      setFormVisible(false); // Close form after saving
    } catch (error) {
      console.error('Error saving profile:', error.response?.data || error.message);
    }
  };

  if (!user) return <p>Cargando...</p>;

  return (
    <div className="account-page">
      <Navbar />
      <h1>Mi Cuenta</h1>

      {/* For regular users */}
      {user.role === 'regular' && (
        <div className="regular-info">
          <p><strong>Nombre:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}

      {/* For engineers */}
      {user.role === 'engineer' && (
        <div className="engineer-section">
          {!formVisible && engineerData && (
            <div className="engineer-info">
              <h2>Perfil de Ingeniero</h2>
              <img src={engineerData.imageUrl} style={{ height:"100px", borderRadius:"20px" }}/>
              <p><strong>Nombre:</strong> {engineerData.name}</p>
              <p><strong>Ciudad:</strong> {engineerData.city}</p>
              <p><strong>Sobre mí:</strong> {engineerData.sobreMi}</p>
              <p><strong>Ingeniero:</strong> {engineerData.ingeniero}</p>
              <h4>Días y Horas de Trabajo:</h4>
              <ul>
                {daysOfWeek.map(({ key, label }) => {
                  const hours = engineerData.workHours[key];
                  return hours ? (
                    <li key={key}>
                      {label}:{' '}
                      {hours.map(({ start, end }, i) => (
                        <span key={i}>
                          {start} - {end}
                          {i < hours.length - 1 && ', '}
                        </span>
                      ))}
                    </li>
                  ) : null;
                })}
              </ul>
              <button className="edit-profile-button" onClick={() => setFormVisible(true)}>
                Editar Perfil
              </button>
            </div>
          )}

          {formVisible && (
            <div className="form-card">
              <h2>Editar Perfil</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="city"
                  placeholder="Ciudad"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
                <textarea
                  name="sobreMi"
                  placeholder="Sobre mí"
                  value={formData.sobreMi}
                  onChange={handleInputChange}
                  required
                />
                <h4>Días y Horas de Trabajo</h4>
                {daysOfWeek.map(({ key, label }) => (
                  <div key={key} className="work-day">
                    <h5>{label}</h5>
                    {(formData.workHours[key] || []).map((time, index) => (
                      <div key={index} className="hours-inputs">
                        <input
                          type="time"
                          value={time.start}
                          onChange={(e) => handleWorkHoursChange(key, index, 'start', e.target.value)}
                          required
                        />
                        <span> a </span>
                        <input
                          type="time"
                          value={time.end}
                          onChange={(e) => handleWorkHoursChange(key, index, 'end', e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="remove-field-button"
                          onClick={() => handleRemoveWorkHour(key, index)}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="add-field-button"
                      onClick={() => handleAddWorkHour(key)}
                    >
                      <FaPlus /> Agregar Hora
                    </button>
                  </div>
                ))}
                <button type="submit" className="submit-profile-button">
                  Guardar Cambios
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Account;
