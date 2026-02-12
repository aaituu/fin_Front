import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { Home } from './pages/Home';
import { Apartments } from './pages/Apartments';
import { ApartmentDetails } from './pages/ApartmentDetails';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { AddApartment } from './pages/AddApartment';
import { EditApartment } from './pages/EditApartment';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';

// Private Route Wrapper
// Admin Route Wrapper
const AdminRoute = ({ children }: { children: React.ReactElement }) => {
  const { user } = useAuth();
  return user?.token && user?.role === 'admin' ? children : <Navigate to="/" />;
};

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const { user } = useAuth();
  return user?.token ? children : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/apartments" element={<Apartments />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/apartments/new" element={
              <PrivateRoute>
                <AddApartment />
              </PrivateRoute>
            } />
            <Route path="/apartments/:id/edit" element={
              <PrivateRoute>
                <EditApartment />
              </PrivateRoute>
            } />
            <Route path="/apartments/:id" element={<ApartmentDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
                      <Route path="/admin" element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            } />
          </Routes>
        </Layout>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;