import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import CrackyHome from './CrackyHome';
import CrackyClassic from './CrackyClassic';

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = sessionStorage.getItem('redirect');
    if (redirect) {
      sessionStorage.removeItem('redirect');
      navigate(redirect, { replace: true });
    }
  }, [navigate]);

  return (
    <main>
      <Routes>
        <Route exact path="/" element={<CrackyHome />} />
        <Route exact path="/classic" element={<CrackyClassic />} />
      </Routes>
    </main>
  );
}