import React, { lazy, Suspense } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "./Home.css"
import Upcoming from './Upcoming';

// Lazy load the Engineer and Regular components
const Engineer = lazy(() => import('../pages/Engineer'));
const Regular = lazy(() => import('../pages/Regular'));

const Home = () => {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    return <p>Loading... Please log in again.</p>;
  }

  return (
    <div className="home">
      {/* Display Navbar */}
      <Navbar />

      {/* Welcome Section */}
      <div className="home-content">
        <h1>Bienvenido, {user.name}</h1>
      </div>

      {/* Conditional Rendering Based on Role */}
      <Suspense fallback={<p>Loading content...</p>}>
        {user.role === 'engineer' ? <Engineer /> : <Regular />}
      </Suspense>

      {/* Display Footer */}
      <Upcoming />
      <Footer />
    </div>
  );
};

export default Home;
