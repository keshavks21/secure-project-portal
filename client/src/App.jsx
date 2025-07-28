import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProjectDetails from './pages/ProjectDetails.jsx';
import AccountSettings from './pages/AccountSettings.jsx';
import Navbar from './components/Navbar.jsx';
import { useAuth } from './context/AuthContext.jsx';
import NewProject from './pages/NewProject.jsx';
import AssignDeveloper from './pages/AssignDeveloper.jsx';
import CompleteProject from './pages/CompleteProject.jsx';
import ActiveProjects from './pages/ActiveProjects.jsx';
import UploadDocuments from './pages/UploadDocument.jsx'; 
import MyProjects from './pages/MyProjects.jsx'; 

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/signin" />;
};

const AppRoutes = () => {
  const { user } = useAuth();
  const location = useLocation();
  const hideNavbarOnRoutes = ['/signin', '/register'];

  return (
    <>
      {!hideNavbarOnRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/projects/new" element={
          user?.role === 'Admin' ? <NewProject /> : <Navigate to="/" />
        } />
        <Route path="/projects/:id" element={<ProtectedRoute element={<ProjectDetails />} />} />
        <Route path="/settings" element={<ProtectedRoute element={<AccountSettings />} />} />
        <Route path="/myprojects" element={<MyProjects />} />
        <Route path="/update/password" element={<AccountSettings />} />

        {/* ✅ Developer/Lead Routes */}
        <Route path="/documents/upload" element={
          (user?.role === 'Developer' || user?.role === 'ProjectLead') 
            ? <UploadDocuments /> 
            : <Navigate to="/" />
        } />

        {/* ✅ Lead Routes */}
        <Route path="/projects/assign" element={
          user?.role === 'ProjectLead' ? <AssignDeveloper /> : <Navigate to="/" />
        } />
        <Route path="/projects/complete" element={
          user?.role === 'Admin' ? <CompleteProject /> : <Navigate to="/" />
        } />
        <Route path="/projects/active" element={
          user?.role === 'ProjectLead' || user?.role === 'Admin' ? <ActiveProjects /> : <Navigate to="/" />
        } />
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
