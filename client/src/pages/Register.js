import React, { useState } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("regular"); // Default role
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      await axios.post("/auth/register", { name, email, password, role });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1>Crear cuenta</h1>
        <p>
          ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nombre o Empresa</label>
            <input
              type="text"
              placeholder="Tu nombre o empresa"
              value={name}
              onChange={(e) => setName(e.target.value.trim())}
              required
            />
          </div>
          <div className="input-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
            />
          </div>
          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
              required
            />
          </div>
          <div className="role-selection">
            <label>Selecciona tu rol:</label>
            <div className="roles">
              <label>
                <input
                  type="radio"
                  value="engineer"
                  checked={role === "engineer"}
                  onChange={(e) => setRole(e.target.value)}
                />
                Soy Ingeniero
              </label>
              <label>
                <input
                  type="radio"
                  value="regular"
                  checked={role === "regular"}
                  onChange={(e) => setRole(e.target.value)}
                />
                Busco Ingenieros
              </label>
            </div>
          </div>
          <button type="submit" className="register-button">
            Crear cuenta
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;
