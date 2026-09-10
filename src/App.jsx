import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Rainfall from './pages/Rainfall';
import Inundation from './pages/Inundation';
import Risk from './pages/Risk';
import Simulation from './pages/Simulation';
import Alerts from './pages/Alerts';
import Historical from './pages/Historical';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  return (
    <div className="App font-sans text-slate-900">
      <BrowserRouter>
        <ScrollToTop/>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/rainfall" element={<Rainfall/>}/>
          <Route path="/inundation" element={<Inundation/>}/>
          <Route path="/risk" element={<Risk/>}/>
          <Route path="/simulation" element={<Simulation/>}/>
          <Route path="/alerts" element={<Alerts/>}/>
          <Route path="/historical" element={<Historical/>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
