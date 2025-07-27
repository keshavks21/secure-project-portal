import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProjectDetails from './pages/ProjectDetails.jsx';
import AccountSettings from './pages/AccountSettings.jsx';
import Navbar from './components/Navbar.jsx';
import { useAuth } from './context/AuthContext.jsx';

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/signin" />;
};

const AppRoutes = () => {
  const location = useLocation();
  const hideNavbarOnRoutes = ['/signin', '/register'];

  return (
    <>
      {!hideNavbarOnRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/projects/:id" element={<ProtectedRoute element={<ProjectDetails />} />} />
        <Route path="/settings" element={<ProtectedRoute element={<AccountSettings />} />} />
      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;