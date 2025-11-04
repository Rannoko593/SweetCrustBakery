import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Register from './components/Register';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import StaffDashboard from './components/StaffDashboard';
import AddProduct from './components/AddProduct';
import ManageProducts from './components/ManageProducts';
import { useState } from 'react';

const App = () => {
  const [authData, setAuthData] = useState(
    localStorage.getItem('token') && localStorage.getItem('role') 
      ? { 
          token: localStorage.getItem('token'), 
          role: localStorage.getItem('role'),
          name: localStorage.getItem('userName')
        } 
      : null
  );

  const setAuth = (data) => {
    if (data) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('userName', data.name);
      setAuthData(data);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userName');
      setAuthData(null);
    }
  };

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!authData) return <Navigate to="/login" />;
    if (!allowedRoles.includes(authData.role)) return <Navigate to="/" />;
    return children;
  };

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar authData={authData} setAuth={setAuth} />
        <div className="container my-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setAuth={setAuth} />} />
            
            {/* Admin Routes */}
            <Route path="/admin-dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/add-product" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddProduct />
              </ProtectedRoute>
            } />
            <Route path="/manage-products" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageProducts />
              </ProtectedRoute>
            } />
            
            {/* Staff Routes */}
            <Route path="/staff-dashboard" element={
              <ProtectedRoute allowedRoles={['staff']}>
                <StaffDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;