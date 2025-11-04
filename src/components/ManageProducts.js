import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '' });
  const [editImage, setEditImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please check if server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Product deleted successfully!');
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      const errorMessage = err.response?.data?.error || 'Please try again';
      alert(`Error deleting product: ${errorMessage}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      description: product.description || '',
      price: product.price
    });
    setImagePreview(product.image_url ? `${process.env.REACT_APP_API_URL}${product.image_url}` : null);
    setEditImage(null);
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    setEditImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editForm.name || !editForm.price) {
      alert('Name and price are required');
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('description', editForm.description);
      formData.append('price', editForm.price);
      
      if (editImage) {
        formData.append('image', editImage);
      }

      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/products/${editingProduct.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      alert('Product updated successfully!');
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err);
      const errorMessage = err.response?.data?.error || 'Please try again';
      alert(`Error updating product: ${errorMessage}`);
    } finally {
      setActionLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditForm({ name: '', description: '', price: '' });
    setEditImage(null);
    setImagePreview(null);
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading products...</span>
        </div>
        <p className="mt-2">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <h4><i className="fas fa-exclamation-triangle me-2"></i>Error</h4>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchProducts}>
          <i className="fas fa-refresh me-2"></i>Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3><i className="fas fa-edit me-2"></i>Manage Products</h3>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/add-product')}
        >
          <i className="fas fa-plus me-2"></i>Add New Product
        </button>
      </div>

      {editingProduct && (
        <div className="card p-4 mb-4">
          <h4><i className="fas fa-edit me-2"></i>Edit Product: {editingProduct.name}</h4>
          <form onSubmit={handleEditSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="form-control"
                    required
                    disabled={actionLoading}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    className="form-control"
                    rows="3"
                    disabled={actionLoading}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Price (M) *</label>
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleEditChange}
                    className="form-control"
                    step="0.01"
                    min="0"
                    required
                    disabled={actionLoading}
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Product Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    disabled={actionLoading}
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="img-thumbnail" 
                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                      />
                      <small className="text-muted d-block mt-1">
                        {editImage ? 'New image selected' : 'Current image'}
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="d-flex gap-2">
              <button 
                type="submit" 
                className="btn btn-success"
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>
                    Update Product
                  </>
                )}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={cancelEdit}
                disabled={actionLoading}
              >
                <i className="fas fa-times me-2"></i>Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {products.length === 0 ? (
        <div className="alert alert-info text-center">
          <i className="fas fa-info-circle me-2"></i>
          No products found. <strong>Add your first product to get started!</strong>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    {product.image_url ? (
                      <img 
                        src={`${process.env.REACT_APP_API_URL}${product.image_url}`} 
                        alt={product.name}
                        className="img-thumbnail"
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                        }}
                      />
                    ) : (
                      <div 
                        className="bg-light d-flex align-items-center justify-content-center"
                        style={{ width: '80px', height: '80px' }}
                      >
                        <i className="fas fa-image text-muted"></i>
                      </div>
                    )}
                  </td>
                  <td>
                    <strong>{product.name}</strong>
                  </td>
                  <td>
                    {product.description || (
                      <span className="text-muted">No description</span>
                    )}
                  </td>
                  <td>
                    <strong className="text-primary">M{parseFloat(product.price).toFixed(2)}</strong>
                  </td>
                  <td>
                    {new Date(product.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => handleEdit(product)}
                        title="Edit Product"
                        disabled={actionLoading}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleDelete(product.id)}
                        title="Delete Product"
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          <i className="fas fa-trash"></i>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;