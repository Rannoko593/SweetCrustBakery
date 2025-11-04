import { useState } from 'react';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setResponseMessage('All fields are required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setResponseMessage('Invalid email format.');
      return;
    }
    axios.post(`${process.env.REACT_APP_API_URL}/api/messages`, formData)
      .then(() => {
        setResponseMessage('Message sent successfully! We will get back to you within 24 hours.');
        setFormData({ name: '', email: '', message: '' });
      })
      .catch(() => setResponseMessage('Error sending message. Please try again or call us directly.'));
  };

  return (
    <div>
      <h2 className="text-center mb-4"><i className="fas fa-envelope me-2"></i>Contact Sweet Crust Bakery</h2>
      
      {/* Contact Hero Section */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="text-center">
            <img 
              src="/images/contact-hero.jpg" 
              className="img-fluid rounded shadow" 
              alt="Visit Our Bakery" 
              style={{maxHeight: '300px', width: '100%', objectFit: 'cover'}}
            />
            <p className="lead mt-3">
              We'd love to hear from you! Get in touch for orders, questions, or just to say hello.
            </p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0"><i className="fas fa-paper-plane me-2"></i>Send Us a Message</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label"><i className="fas fa-user me-2"></i>Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" required placeholder="Enter your full name" />
                </div>
                <div className="mb-3">
                  <label className="form-label"><i className="fas fa-envelope me-2"></i>Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required placeholder="your.email@example.com" />
                </div>
                <div className="mb-3">
                  <label className="form-label"><i className="fas fa-comment me-2"></i>Your Message *</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} className="form-control" rows={5} required placeholder="Tell us about your inquiry, custom order, or feedback..." />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  <i className="fas fa-paper-plane me-2"></i>Send Message
                </button>
                {responseMessage && (
                  <div className={`alert mt-3 ${responseMessage.includes('Error') || responseMessage.includes('Invalid') ? 'alert-danger' : 'alert-success'}`}>
                    {responseMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0"><i className="fas fa-info-circle me-2"></i>Get in Touch</h5>
            </div>
            <div className="card-body">
              <h6><i className="fas fa-map-marker-alt me-2 text-danger"></i>Visit Our Bakery</h6>
              <p className="mb-3">Maseru 100, Lesotho<br />
              <small className="text-muted">Nestled in the heart of the city, easy to find with plenty of parking</small></p>

              <h6><i className="fas fa-phone me-2 text-primary"></i>Call Us Directly</h6>
              <p className="mb-3">+266 58591901<br />
              <small className="text-muted">Perfect for urgent orders or immediate assistance</small></p>

              <h6><i className="fas fa-envelope me-2 text-warning"></i>Email Us</h6>
              <p className="mb-3">info@sweetcrust.ls<br />
              <small className="text-muted">We respond to all emails within 24 hours</small></p>

              <h6><i className="fas fa-clock me-2 text-info"></i>Opening Hours</h6>
              <p className="mb-1">Monday - Friday: 8:00 AM – 8:00 PM</p>
              <p className="mb-1">Saturday: 9:00 AM – 6:00 PM</p>
              <p className="mb-3">Sunday: Closed</p>

              <h6><i className="fas fa-concierge-bell me-2 text-success"></i>Special Services</h6>
              <ul className="list-unstyled">
                <li><i className="fas fa-check me-2 text-success small"></i>Custom Cakes & Pastries</li>
                <li><i className="fas fa-check me-2 text-success small"></i>Catering for Events</li>
                <li><i className="fas fa-check me-2 text-success small"></i>Bulk Orders</li>
                <li><i className="fas fa-check me-2 text-success small"></i>Special Dietary Requirements</li>
              </ul>

              <div className="mt-4 p-3 bg-light rounded">
                <h6><i className="fas fa-lightbulb me-2"></i>Quick Tip</h6>
                <p className="small mb-0">For custom cake orders, please contact us at least 48 hours in advance to ensure we can create something special for you!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;