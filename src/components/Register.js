import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'staff' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setMessage('Name, email, and password are required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage('Invalid email format.');
      return;
    }
    axios.post(`${process.env.REACT_APP_API_URL}/api/register`, formData)
      .then(() => {
        setMessage('Registration successful! Please log in.');
        setFormData({ name: '', email: '', password: '', role: 'staff' });
        setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
      })
      .catch(() => setMessage('Error registering. Email may already be in use.'));
  };

  return (
    <div>
      <h2 className="text-center mb-4"><i className="fas fa-user-plus me-2"></i>Register</h2>
      <form onSubmit={handleSubmit} className="col-md-6 mx-auto">
        <div className="mb-3">
          <label className="form-label"><i className="fas fa-user me-2"></i>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label"><i className="fas fa-envelope me-2"></i>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label"><i className="fas fa-lock me-2"></i>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label"><i className="fas fa-user-tag me-2"></i>Role</label>
          <select name="role" value={formData.role} onChange={handleChange} className="form-control" required>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary"><i className="fas fa-user-plus me-2"></i>Register</button>
        {message && (
          <div className={`alert mt-3 ${message.includes('Error') || message.includes('Invalid') ? 'alert-danger' : 'alert-success'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default Register;