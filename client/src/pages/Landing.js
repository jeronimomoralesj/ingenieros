import React from 'react';
import './Landing.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Consult from '../components/Consult';

const Landing = () => {
  return (
    <div>
        <section className="hero">
        <Navbar />
        <div className="hero-container">
            {/* Left Section: Text Content */}
            <div className="hero-text">
            <h1>
                Conectamos <span>expertos</span> altamente <br />
                calificados con clientes <span>necesitados</span> <br />
                de soluciones rápidas y seguras.
            </h1>
            <p>
                Somos un Marketplace de expertos en ingeniería. Estudiamos, validamos y garantizamos
                expertos de muy alto valor.
            </p>
            <button className="hero-button">Encuentra tu ingeniero</button>
            </div>

            {/* Right Section: Image Content */}
            <div className="hero-images">
            <img
                src="https://images.assettype.com/fortuneindia/2024-08/14402ebf-36f3-4c02-bcd7-d58287add8d0/Women%20Engineers%201.jpg?w=1250&q=60"
                alt="Engineer"
                className="main-image"
            />
            </div>
        </div>

        {/* Static Logos Section */}
        <div className="trusted-companies">
            <h2>Empresas que confían en nosotros</h2>
            <div className="logos-container">
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                alt="Apple Logo"
                className="logo"
            />
            <img
                src="https://yt3.googleusercontent.com/IaWgQsxHvV8wWjfGh-h-udUSyjFIT6p_yv3kS6a-QCDI84_6pJIskHsjFMkqnBmIqbuElhZI=s900-c-k-c0x00ffffff-no-rj"
                alt="Google Logo"
                className="logo"
            />
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png"
                alt="Google G Logo"
                className="logo"
            />
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png"
                alt="Microsoft Logo"
                className="logo"
            />
            </div>
        </div>

        <br />
        <br />
        <br />


        {/* Section 1: Engineer Directory */}
        <div className="services-section">
            <div className="services-content">
            <img
                src="https://selia.co/wp-content/uploads/elementor/thumbs/services-header-qpnln3394pgx82gc1zmly9ftkltri6udxjjj4cw9li.png"
                alt="Engineer Directory"
                className="services-image"
            />
            <div className="services-text">
                <h2>Directorio de Ingenieros</h2>
                <p>
                Encuentra todos nuestros ingenieros en el directorio. Reserva fácilmente tu primera
                llamada en línea para resolver tus dudas y avanzar en tu proyecto.
                </p>
            </div>
            </div>

            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />

        {/* Section 2: Form for Assistance */}
            <div className="services-content">
            <div className="services-text">
                <h2>Formulario de Asistencia</h2>
                <p>
                Completa un formulario describiendo tu problema y en menos de 72 horas te responderemos
                con la mejor solución diseñada específicamente para ti.
                </p>
            </div>
            <img
                src="https://virtual.cuc.edu.co/hs-fs/hubfs/Imported_Blog_Media/areas-de-trabajo-ingenieria-industrial_png.webp?width=800&height=500&name=areas-de-trabajo-ingenieria-industrial_png.webp"
                alt="Assistance Form"
                className="services-image"
            />
            </div>
        </div>
        </section>
<div id='consulta'>
        <Consult />
        </div>

        <Footer />
    </div>
  );
};

export default Landing;
