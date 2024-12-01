import React, { useState } from 'react';
import './Consult.css';
import axios from '../axiosConfig';

const Consult = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    city: '',
    description: '',
    file: null,
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const formDataObject = new FormData();
    for (const key in formData) {
      formDataObject.append(key, formData[key]);
    }

    try {
      await axios.post('/consult', formDataObject, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Consulta enviada exitosamente. Te responderemos en menos de 72 horas.');
    } catch (err) {
      setErrorMessage('Hubo un error al enviar tu consulta. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="consult-form-container">
      <h1>Cuéntanos tu caso</h1>
      <p>Y recibe tu cotización en hasta 72 horas</p>
      <form onSubmit={handleSubmit} className="consult-form">
        <label>
          Nombre o Empresa:
          <input
            type="text"
            name="name"
            placeholder="Tu nombre o empresa"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Correo Electrónico:
          <input
            type="email"
            name="email"
            placeholder="Tu correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Teléfono:
          <input
            type="text"
            name="phone"
            placeholder="Tu teléfono"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Especialidad:
          <input
            type="text"
            name="specialty"
            placeholder="La especialidad que buscas o simplemente escribe no se"
            value={formData.specialty}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Ciudad:
          <input
            type="text"
            name="city"
            placeholder="Tu ciudad"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Descripción del Caso:
          <textarea
            name="description"
            placeholder="Por favor indicar detalles sobre el caso y/o situación..."
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </label>
        <label>
          Adjuntos:
          <input type="file" name="file" onChange={handleFileChange} />
        </label>
        <button type="submit" className="consult-submit-button">
          Enviar
        </button>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Consult;
