import { useState, useEffect } from 'react';
import axios from 'axios';

const AddOrder = () => {
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState({ 
    customer_name: '', 
    product_id: '', 
    quantity: 1,
    order_date: new Date().toISOString().split('T')[0],
    status: 'Pending'
  });
  const [loading, setLoading] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      alert('Failed to load products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!order.customer_name.trim()) {
      alert('Customer name is required');
      return;
    }
    if (!order.product_id) {
      alert('Please select a product');
      return;
    }
    if (order.quantity < 1) {
      alert('Quantity must be at least 1');
      return;
    }
    if (!order.order_date) {
      alert('Order date is required');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const orderData = {
        customer_name: order.customer_name.trim(),
        product_id: order.product_id,
        quantity: parseInt(order.quantity),
        order_date: order.order_date,
        status: order.status
      };

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/orders`, orderData, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      setLastOrder(response.data);
      
      alert(`Order added successfully!\nStatus: ${response.data.status}\nOrder ID: ${response.data.id}`);
      
      setOrder({ 
        customer_name: '', 
        product_id: '', 
        quantity: 1,
        order_date: new Date().toISOString().split('T')[0],
        status: order.status
      });
    } catch (err) {
      console.error('Error adding order:', err);
      alert('Error adding order: ' + (err.response?.data?.error || 'Please try again'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setOrder({
      ...order,
      [e.target.name]: e.target.value
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed': return 'bg-success';
      case 'Cancelled': return 'bg-danger';
      case 'Pending': return 'bg-warning';
      default: return 'bg-secondary';
    }
  };

  const getSelectedProduct = () => {
    return products.find(p => p.id == order.product_id);
  };

  return (
    <div className="card p-4">
      <h3 className="mb-4">
        <i className="fas fa-plus-circle me-2"></i>Add New Order
      </h3>
      
      {lastOrder && (
        <div className="alert alert-success mb-4">
          <h5>
            <i className="fas fa-check-circle me-2"></i>Order Created Successfully!
          </h5>
          <div className="row mt-2">
            <div className="col-md-6">
              <p><strong>Order ID:</strong> #{lastOrder.id}</p>
              <p><strong>Customer:</strong> {lastOrder.customer_name}</p>
              <p><strong>Status:</strong> 
                <span className={`badge ms-2 ${getStatusBadgeClass(lastOrder.status)}`}>
                  {lastOrder.status}
                </span>
              </p>
            </div>
            <div className="col-md-6">
              <p><strong>Date:</strong> {new Date(lastOrder.order_date).toLocaleDateString()}</p>
              <p><strong>Quantity:</strong> {lastOrder.quantity}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">
                <i className="fas fa-user me-2"></i>Customer Name *
              </label>
              <input 
                type="text" 
                name="customer_name" 
                value={order.customer_name} 
                onChange={handleChange}
                className="form-control" 
                placeholder="Enter customer name"
                required 
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                <i className="fas fa-shopping-basket me-2"></i>Product Ordered *
              </label>
              <select 
                name="product_id" 
                value={order.product_id} 
                onChange={handleChange}
                className="form-control" 
                required
              >
                <option value="">Select a product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - M{parseFloat(product.price || 0).toFixed(2)}
                  </option>
                ))}
              </select>
              {products.length === 0 && (
                <small className="text-danger">No products available. Please add products first.</small>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">
                <i className="fas fa-hashtag me-2"></i>Quantity *
              </label>
              <input 
                type="number" 
                name="quantity" 
                value={order.quantity} 
                onChange={handleChange}
                min="1" 
                max="100"
                className="form-control" 
                required 
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">
                <i className="fas fa-calendar me-2"></i>Order Date *
              </label>
              <input 
                type="date" 
                name="order_date" 
                value={order.order_date} 
                onChange={handleChange}
                className="form-control" 
                required 
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                <i className="fas fa-tasks me-2"></i>Order Status *
              </label>
              <select 
                name="status" 
                value={order.status} 
                onChange={handleChange}
                className="form-control" 
                required
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <small className="text-muted">
                Current selection: 
                <span className={`badge ms-2 ${getStatusBadgeClass(order.status)}`}>
                  {order.status}
                </span>
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label">
                <i className="fas fa-id-card me-2"></i>Order ID
              </label>
              <input 
                type="text" 
                className="form-control" 
                value="Auto-generated" 
                disabled 
                style={{ backgroundColor: '#f8f9fa', color: '#6c757d' }}
              />
              <small className="text-muted">Order ID will be automatically generated after submission</small>
            </div>
          </div>
        </div>

        <div className="card mt-3 mb-4">
          <div className="card-header bg-light">
            <h6 className="mb-0">
              <i className="fas fa-eye me-2"></i>Current Order Preview
            </h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <p><strong>Customer:</strong> {order.customer_name || 'Not specified'}</p>
                <p><strong>Product:</strong> {
                  getSelectedProduct()?.name || 'Not selected'
                }</p>
                <p><strong>Quantity:</strong> {order.quantity}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Date:</strong> {order.order_date}</p>
                <p><strong>Status:</strong> 
                  <span className={`badge ms-2 ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button 
            type="submit" 
            className="btn btn-primary btn-lg"
            disabled={loading || products.length === 0}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin me-2"></i>
                Adding Order...
              </>
            ) : (
              <>
                <i className="fas fa-save me-2"></i>
                Add Order ({order.status})
              </>
            )}
          </button>

          <button 
            type="button" 
            className="btn btn-outline-secondary ms-2"
            onClick={() => setOrder({ 
              customer_name: '', 
              product_id: '', 
              quantity: 1,
              order_date: new Date().toISOString().split('T')[0],
              status: 'Pending'
            })}
            disabled={loading}
          >
            <i className="fas fa-times me-2"></i>
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOrder;