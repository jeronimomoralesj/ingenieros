import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import Requests from './Requests'; // Import the Requests page
import './Engineer.css';
import { FaTrashAlt, FaPlus } from "react-icons/fa";


const Engineer = () => {
  const [profile, setProfile] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    sobreMi: '',
    ingeniero: '',
    estudios: [{ institution: '', degree: '' }],
    servicios: [{ service: '', cost: '' }],
    imageUrl: '',
    workHours: {},
    availableDays: [],
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
    const fetchProfile = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const response = await axios.get(`/engineers/profile/${user.id}`);
          setProfile(response.data);

          // Prepopulate form data with fetched profile
          setFormData({
            name: response.data.name,
            city: response.data.city,
            sobreMi: response.data.sobreMi,
            ingeniero: response.data.ingeniero,
            estudios: response.data.estudios.length > 0 ? response.data.estudios : [{ institution: '', degree: '' }],
            servicios: response.data.servicios.length > 0 ? response.data.servicios : [{ service: '', cost: '' }],
            imageUrl: response.data.imageUrl || '',
            workHours: response.data.workHours || {},
            availableDays: Object.keys(response.data.workHours || {}),
          });
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setProfile(null); // No profile found
        } else {
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => {
      const updatedDays = prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day];
      return { ...prev, availableDays: updatedDays };
    });
  };

  const handleWorkHoursChange = (day, key, value) => {
    setFormData((prev) => ({
      ...prev,
      workHours: {
        ...prev.workHours,
        [day]: { ...prev.workHours[day], [key]: value },
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
      setProfile(response.data.engineer);
      setFormVisible(false); // Close form after saving
    } catch (error) {
      console.error('Error saving profile:', error.response?.data || error.message);
    }
  };

  return (
    <div className="engineer-page">
      {/* If profile exists and form is not visible, show Requests */}
      {profile && !formVisible && <Requests />}

      {/* Show "Crear Perfil" button if no profile exists */}
      {!profile && !formVisible && (
        <button className="create-profile-button" onClick={() => setFormVisible(true)}>
          Crear Perfil
        </button>
      )}

      {/* Profile form */}
      {formVisible && (
        <div className="form-card">
          <h2>{profile ? 'Edita tu perfil' : 'Crea tu perfil'}</h2>
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
            <input
              type="text"
              name="ingeniero"
              placeholder="Tipo de ingeniero"
              value={formData.ingeniero}
              onChange={handleInputChange}
              required
            />
            <h4>Estudios</h4>
            {formData.estudios.map((item, index) => (
              <div key={index} className="dynamic-field">
                <input
                  type="text"
                  placeholder="Institución"
                  value={item.institution}
                  onChange={(e) => {
                    const updated = [...formData.estudios];
                    updated[index].institution = e.target.value;
                    setFormData((prev) => ({ ...prev, estudios: updated }));
                  }}
                  required
                />
                <input
                  type="text"
                  placeholder="Título"
                  value={item.degree}
                  onChange={(e) => {
                    const updated = [...formData.estudios];
                    updated[index].degree = e.target.value;
                    setFormData((prev) => ({ ...prev, estudios: updated }));
                  }}
                  required
                />
                <button
                  type="button"
                  className="remove-field-button"
                  onClick={() => handleRemoveField('estudios', index)}
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}
            <button type="button" className="add-field-button" onClick={() => handleAddField('estudios')}>
              <FaPlus /> Agregar Estudio
            </button>

            <h4>Servicios</h4>
            {formData.servicios.map((item, index) => (
              <div key={index} className="dynamic-field">
                <input
                  type="text"
                  placeholder="Servicio"
                  value={item.service}
                  onChange={(e) => {
                    const updated = [...formData.servicios];
                    updated[index].service = e.target.value;
                    setFormData((prev) => ({ ...prev, servicios: updated }));
                  }}
                  required
                />
                <input
                  type="number"
                  placeholder="Costo"
                  value={item.cost}
                  onChange={(e) => {
                    const updated = [...formData.servicios];
                    updated[index].cost = e.target.value;
                    setFormData((prev) => ({ ...prev, servicios: updated }));
                  }}
                  required
                />
                <button
                  type="button"
                  className="remove-field-button"
                  onClick={() => handleRemoveField('servicios', index)}
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}
            <button type="button" className="add-field-button" onClick={() => handleAddField('servicios')}>
              <FaPlus /> Agregar Servicio
            </button>

            <h4>Días y Horas de Trabajo</h4>
            <div className="work-hours-container">
              {daysOfWeek.map(({ key, label }) => (
                <div key={key} className="work-day">
                  <label className="day-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.availableDays.includes(key)}
                      onChange={() => handleDayToggle(key)}
                    />
                    {label}
                  </label>
                  {formData.availableDays.includes(key) && (
                    <div className="hours-inputs">
                      <input
                        type="time"
                        value={formData.workHours[key]?.start || ''}
                        onChange={(e) => handleWorkHoursChange(key, 'start', e.target.value)}
                      />
                      <span> a </span>
                      <input
                        type="time"
                        value={formData.workHours[key]?.end || ''}
                        onChange={(e) => handleWorkHoursChange(key, 'end', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button type="submit" className="submit-profile-button">
              Guardar Perfil
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Engineer;
