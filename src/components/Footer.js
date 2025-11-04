import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h5><i className="fas fa-bread-slice me-2"></i>Sweet Crust Bakery</h5>
            <p>
              Crafting delicious, hand-made baked goods with love in Maseru, Lesotho since 2020.
            </p>
          </div>
          <div className="col-md-4 mb-4">
            <h5><i className="fas fa-link me-2"></i>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="footer-link"><i className="fas fa-home me-1"></i>Home</Link></li>
              <li><Link to="/about" className="footer-link"><i className="fas fa-info-circle me-1"></i>About Us</Link></li>
              <li><Link to="/contact" className="footer-link"><i className="fas fa-envelope me-1"></i>Contact</Link></li>
            </ul>
          </div>
          <div className="col-md-4 mb-4">
            <h5><i className="fas fa-address-card me-2"></i>Contact Us</h5>
            <p><i className="fas fa-map-marker-alt me-2"></i>Maseru 100, Lesotho</p>
            <p><i className="fas fa-phone me-2"></i>+266 58591901</p>
            <p><i className="fas fa-envelope me-2"></i>info@sweetcrust.ls</p>
          </div>
        </div>
        <div className="text-center mt-4">
          <p>&copy; 2025 Sweet Crust Bakery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;