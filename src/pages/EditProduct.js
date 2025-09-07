import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    specs: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    // Check if user is a seller or admin
    const userType = localStorage.getItem('userType');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn || (userType !== 'seller' && userType !== 'admin')) {
      alert('Unauthorized access');
      navigate('/login');
      return;
    }

    // Load product data
    const products = JSON.parse(localStorage.getItem('naivra-products') || '[]');
    const product = products.find(p => p.id === parseInt(id));
    
    if (!product) {
      alert('Product not found');
      navigate('/');
      return;
    }

    // Check if seller is authorized to edit this product
    const sellerId = localStorage.getItem('sellerId');
    if (userType === 'seller' && product.sellerId !== sellerId) {
      alert('You can only edit your own products');
      navigate('/seller-dashboard');
      return;
    }

    setFormData(product);
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const products = JSON.parse(localStorage.getItem('naivra-products') || '[]');
    const updatedProducts = products.map(p => {
      if (p.id === parseInt(id)) {
        return {
          ...p,
          ...formData,
          price: parseFloat(formData.price),
          lastModified: new Date().toISOString()
        };
      }
      return p;
    });

    localStorage.setItem('naivra-products', JSON.stringify(updatedProducts));
    alert('Product updated successfully!');
    navigate('/seller-dashboard');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      const products = JSON.parse(localStorage.getItem('naivra-products') || '[]');
      const updatedProducts = products.filter(p => p.id !== parseInt(id));
      localStorage.setItem('naivra-products', JSON.stringify(updatedProducts));
      alert('Product deleted successfully!');
      navigate('/seller-dashboard');
    }
  };

  return (
    <div className="edit-product-container" style={{ padding: '2rem' }}>
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit} className="edit-product-form">
        <div className="form-group">
          <label htmlFor="name">Carpet Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price ($)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label htmlFor="specs">Specifications</label>
          <input
            type="text"
            id="specs"
            name="specs"
            value={formData.specs}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image URL</label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Update Product
          </button>
          <button 
            type="button" 
            onClick={handleDelete}
            style={{
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Delete Product
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/seller-dashboard')}
            style={{
              backgroundColor: '#808080',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
