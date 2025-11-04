import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ authData, setAuth }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth(null);
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg award-navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-bread-slice me-2"></i>Sweet Crust Bakery
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/"><i className="fas fa-home me-1"></i>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about"><i className="fas fa-info-circle me-1"></i>About Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact"><i className="fas fa-envelope me-1"></i>Contact</Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            {authData?.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin-dashboard">
                  <i className="fas fa-tachometer-alt me-1"></i>Dashboard
                </Link>
              </li>
            )}
            {authData?.role === 'staff' && (
              <li className="nav-item">
                <Link className="nav-link" to="/staff-dashboard">
                  <i className="fas fa-tachometer-alt me-1"></i>Dashboard
                </Link>
              </li>
            )}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="profileDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="fas fa-user me-2"></i>
                {authData ? `Welcome, ${authData.name || authData.role}` : 'Profile'}
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                {!authData ? (
                  <>
                    <li><Link className="dropdown-item" to="/register"><i className="fas fa-user-plus me-1"></i>Register</Link></li>
                    <li><Link className="dropdown-item" to="/login"><i className="fas fa-sign-in-alt me-1"></i>Login</Link></li>
                  </>
                ) : (
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-1"></i>Logout
                    </button>
                  </li>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;