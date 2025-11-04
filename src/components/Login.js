import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setAuth }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setMessage('Email and password are required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage('Invalid email format.');
      return;
    }

    axios.post(`${process.env.REACT_APP_API_URL}/api/login`, formData)
      .then(res => {
        const authData = {
          ...res.data,
          name: res.data.name || res.data.role
        };
        setAuth(authData);
        if (res.data.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/staff-dashboard');
        }
      })
      .catch(() => setMessage('Invalid credentials.'));
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h2 className="text-center mb-4"><i className="fas fa-sign-in-alt me-2"></i>Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label"><i className="fas fa-envelope me-2"></i>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className="form-control" 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label"><i className="fas fa-lock me-2"></i>Password</label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  className="form-control" 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                <i className="fas fa-sign-in-alt me-2"></i>Login
              </button>
              {message && (
                <div className={`alert mt-3 ${
                  message.includes('Error') || message.includes('Invalid') ? 'alert-danger' : 'alert-success'
                }`}>
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;