import { Link, Outlet, useNavigate } from 'react-router-dom';

const AdminDashboard = ({ setAuth }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (setAuth) {
      setAuth(null);
    } else {
      // Fallback if setAuth is not provided
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userName');
      window.location.href = '/';
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar bg-light p-3" style={{ minWidth: '250px', minHeight: '100vh' }}>
        <h4>Admin Panel</h4>
        <ul className="list-unstyled">
          <li className="mb-2">
            <Link to="/add-product" className="btn btn-outline-primary mb-2 w-100 text-start">
              <i className="fas fa-plus me-2"></i>Add Product
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/manage-products" className="btn btn-outline-primary mb-2 w-100 text-start">
              <i className="fas fa-edit me-2"></i>Manage Products
            </Link>
          </li>
          <li className="mt-4">
            <button 
              className="btn btn-outline-danger w-100"
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt me-2"></i>Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="dashboard-content flex-grow-1 p-4">
        <h2>Welcome to Admin Dashboard</h2>
        <p className="text-muted">Manage products and oversee bakery operations</p>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;