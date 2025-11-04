import { useState } from 'react';
import AddOrder from './AddOrder';
import Orders from './Orders';
import { useNavigate } from 'react-router-dom';

const StaffDashboard = ({ setAuth }) => {
  const [activeTab, setActiveTab] = useState('orders');
  const navigate = useNavigate();

  const handleLogout = () => {
    if (setAuth) {
      setAuth(null);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userName');
      navigate('/');
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar bg-light p-3" style={{ minWidth: '250px', minHeight: '100vh' }}>
        <h4>Staff Panel</h4>
        <ul className="list-unstyled">
          <li className="mb-2">
            <button 
              className={`btn w-100 text-start ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('orders')}
            >
              <i className="fas fa-list me-2"></i>View Orders
            </button>
          </li>
          <li className="mb-2">
            <button 
              className={`btn w-100 text-start ${activeTab === 'add-order' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('add-order')}
            >
              <i className="fas fa-plus me-2"></i>Add Order
            </button>
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
        <h2>Staff Dashboard</h2>
        <p className="text-muted">Manage customer orders and track their status</p>
        
        {activeTab === 'orders' && <Orders />}
        {activeTab === 'add-order' && <AddOrder />}
      </div>
    </div>
  );
};

export default StaffDashboard;