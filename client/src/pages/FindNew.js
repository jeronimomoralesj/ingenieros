import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import './FindNew.css';
import Book from './Book';

const FindNew = () => {
  const [engineers, setEngineers] = useState([]);
  const [filteredEngineers, setFilteredEngineers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ name: '', type: '' });
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const usersPerPage = 6;

  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const response = await axios.get('/engineers/all');
        setEngineers(response.data);
        setFilteredEngineers(response.data);
        setTotalPages(Math.ceil(response.data.length / usersPerPage));
      } catch (error) {
        console.error('Error fetching engineers:', error);
      }
    };

    fetchEngineers();
  }, []);

  const applyFilters = (nameFilter, typeFilter) => {
    const filtered = engineers.filter((engineer) => {
      const matchesName = engineer.name
        .toLowerCase()
        .includes(nameFilter.toLowerCase());
      const matchesType = engineer.ingeniero
        .toLowerCase()
        .includes(typeFilter.toLowerCase());
      return matchesName && matchesType;
    });

    setFilteredEngineers(filtered);
    setTotalPages(Math.ceil(filtered.length / usersPerPage));
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [name]: value };
      applyFilters(updatedFilters.name, updatedFilters.type);
      return updatedFilters;
    });
  };

  const currentUsers = filteredEngineers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleViewProfile = (engineer) => {
    setSelectedEngineer(engineer);
  };

  const handleSchedule = (engineer) => {
    setSelectedEngineer(engineer);
  };

  const closePopup = () => {
    setSelectedEngineer(null);
  };

  return (
    <div className="find-new-container">
      <h1>Encuentra Nuevos Ingenieros</h1>
      <div className="filters">
        <input
          type="text"
          name="name"
          placeholder="Filtrar por nombre"
          value={filters.name}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <input
          type="text"
          name="type"
          placeholder="Filtrar por tipo de ingeniero"
          value={filters.type}
          onChange={handleFilterChange}
          className="filter-input"
        />
      </div>
      <br />
      <div className="card-grid">
        {currentUsers.map((engineer) => (
          <div key={engineer.userId} className="card">
            <div className="card-header">
              <img
                src={engineer.imageUrl || 'https://via.placeholder.com/150'}
                alt={engineer.name}
                className="profile-image"
              />
              <div className="card-title">
                <h3>{engineer.name}</h3>
                <p style={{ textAlign: "left" }}>{engineer.ingeniero}</p>
              </div>
            </div>
            <div className="card-details">
              <p>
                <strong>Experiencia:</strong> {engineer.experience || 'No especificada'}
              </p>
              <p>
                <strong>Ciudad:</strong> {engineer.city}
              </p>
              <p>
                <strong>Calificación:</strong> ⭐ {engineer.starCount || 'Sin calificación'}
              </p>
              <p>
                <strong>Especialidades:</strong>{' '}
                {engineer.servicios.map((service, index) => (
                  <span key={index} className="service-tag">
                    {service.service}
                  </span>
                ))}
              </p>
              <p>
                <strong>Costo del servicio:</strong> COP{' '}
                {engineer.servicios[0]?.cost || 'No especificado'}
              </p>
            </div>
            <div className="card-footer">
              <button
                className="view-profile-button"
                onClick={() => handleViewProfile(engineer)}
              >
                Ver Perfil
              </button>
              <button
                className="schedule-button"
                onClick={() => handleSchedule(engineer)}
              >
                Agendar
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button
          className="pagination-button"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <FaArrowLeft /> Anterior
        </button>
        <span className="pagination-info">
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="pagination-button"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Siguiente <FaArrowRight />
        </button>
      </div>

      {/* Popup for Book.js */}
      {selectedEngineer && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <Book engineer={selectedEngineer} closePopup={closePopup} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FindNew;
