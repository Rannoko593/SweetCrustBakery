import { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please check if server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/orders/${id}`, 
        { status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Order status updated to ${status}`);
      fetchOrders();
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Error updating order status: ' + (err.response?.data?.error || 'Please try again'));
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed': return 'bg-success';
      case 'Cancelled': return 'bg-danger';
      case 'Pending': return 'bg-warning';
      default: return 'bg-secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading orders...</span>
        </div>
        <p className="mt-2">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <h4><i className="fas fa-exclamation-triangle me-2"></i>Error Loading Orders</h4>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchOrders}>
          <i className="fas fa-refresh me-2"></i>Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3><i className="fas fa-list me-2"></i>All Orders</h3>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={fetchOrders}>
            <i className="fas fa-refresh me-2"></i>Refresh
          </button>
          <span className="badge bg-primary">
            {orders.length} order{orders.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      
      {orders.length === 0 ? (
        <div className="alert alert-info text-center">
          <i className="fas fa-info-circle me-2"></i>
          No orders found. <strong>Add your first order to get started!</strong>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Order Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const unitPrice = parseFloat(order.price) || 0;
                
                return (
                  <tr key={order.id}>
                    <td><strong>#{order.id}</strong></td>
                    <td>{order.customer_name}</td>
                    <td>
                      {order.product_name}
                      <small className="text-muted d-block">M{unitPrice.toFixed(2)} each</small>
                    </td>
                    <td>
                      <span className="badge bg-secondary">{order.quantity}</span>
                    </td>
                    <td>{formatDate(order.order_date)}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        {order.status === 'Pending' && (
                          <>
                            <button 
                              className="btn btn-success" 
                              onClick={() => {
                                if (window.confirm('Are you sure you want to mark this order as Completed?')) {
                                  updateStatus(order.id, 'Completed');
                                }
                              }}
                              title="Mark as Completed"
                            >
                              <i className="fas fa-check me-1"></i>Complete
                            </button>
                            <button 
                              className="btn btn-danger" 
                              onClick={() => {
                                if (window.confirm('Are you sure you want to cancel this order?')) {
                                  updateStatus(order.id, 'Cancelled');
                                }
                              }}
                              title="Cancel Order"
                            >
                              <i className="fas fa-times me-1"></i>Cancel
                            </button>
                          </>
                        )}
                        {order.status === 'Completed' && (
                          <button 
                            className="btn btn-warning" 
                            onClick={() => {
                              if (window.confirm('Are you sure you want to mark this order as Pending?')) {
                                updateStatus(order.id, 'Pending');
                              }
                            }}
                            title="Mark as Pending"
                          >
                            <i className="fas fa-clock me-1"></i>Pending
                          </button>
                        )}
                        {order.status === 'Cancelled' && (
                          <button 
                            className="btn btn-warning" 
                            onClick={() => {
                              if (window.confirm('Are you sure you want to reactivate this order?')) {
                                updateStatus(order.id, 'Pending');
                              }
                            }}
                            title="Reactivate Order"
                          >
                            <i className="fas fa-redo me-1"></i>Reactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;