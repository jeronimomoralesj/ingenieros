import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaHeart, FaUser, FaSignOutAlt, FaCalendar } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { FaQuestion } from "react-icons/fa";
import { FaLink } from "react-icons/fa";  // Added for the link icon

import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  // Check if the user is logged in
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    // Navigate to login page
    navigate("/login");
  };

  return (
    <div className="bottom-navbar">
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/" className="nav-item">
              <FaHome className="icon" />
              <span>Inicio</span>
            </Link>
          </li>

          {!user ? (
            <>
              <li>
                <Link to="/favorites" className="nav-item">
                  <FaHeart className="icon" />
                  <span>¿Qué somos?</span>
                </Link>
              </li>
              <li>
                <Link to="#consulta" className="nav-item">
                  <FaQuestion className="icon" />
                  <span>Consulta</span>
                </Link>
              </li>
              <li>
                <Link to="/register" className="nav-item">
                  <IoIosAddCircle className="icon" />
                  <span>Empieza hoy</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="nav-item">
                  <FaUser className="icon" />
                  <span>Inicia sesión</span>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/account" className="nav-item">
                  <FaUser className="icon" />
                  <span>Cuenta</span>
                </Link>
              </li>
              <li>
                <Link to="/consult" className="nav-item">
                  <FaQuestion className="icon" />
                  <span>Consulta</span>
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="nav-item">
                  <FaCalendar className="icon" />
                  <span>Calendario</span>
                </Link>
              </li>
              <li>
                <Link to="/link-generator" className="nav-item">
                  <FaLink className="icon" />
                  <span>Generar Enlace</span>
                </Link>
              </li>
              <li>
                <div className="nav-item" onClick={handleLogout}>
                  <FaSignOutAlt className="icon" />
                  <span>Salir</span>
                </div>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
