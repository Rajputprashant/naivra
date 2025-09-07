import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [newSeller, setNewSeller] = useState({
    username: '',
    password: '',
    businessName: '',
    email: ''
  });

  useEffect(() => {
    // Check if user is admin
    const userType = localStorage.getItem('userType');
    if (userType !== 'admin') {
      navigate('/login');
      return;
    }

    // Load sellers and their products
    const storedSellers = JSON.parse(localStorage.getItem('naivra-sellers') || '[]');
    const storedProducts = JSON.parse(localStorage.getItem('naivra-products') || '[]');
    // Only keep products that have a valid sellerId
    const sellerProducts = storedProducts.filter(product => product.sellerId);
    setSellers(storedSellers);
    setProducts(sellerProducts);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSeller(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSeller = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!newSeller.username || !newSeller.password || !newSeller.businessName || !newSeller.email) {
      alert('Please fill in all fields');
      return;
    }

    // Add new seller
    const updatedSellers = [...sellers, {
      ...newSeller,
      id: Date.now(),
      status: 'active',
      dateAdded: new Date().toISOString()
    }];
    console.log('Adding new seller:', JSON.stringify(updatedSellers[updatedSellers.length - 1], null, 2));

    // Save to localStorage
    localStorage.setItem('naivra-sellers', JSON.stringify(updatedSellers));
    setSellers(updatedSellers);

    // Reset form
    setNewSeller({
      username: '',
      password: '',
      businessName: '',
      email: ''
    });

    alert('Seller added successfully!');
  };

  const toggleSellerStatus = (sellerId) => {
    const updatedSellers = sellers.map(seller => {
      if (seller.id === sellerId) {
        return {
          ...seller,
          status: seller.status === 'active' ? 'inactive' : 'active'
        };
      }
      return seller;
    });

    localStorage.setItem('naivra-sellers', JSON.stringify(updatedSellers));
    setSellers(updatedSellers);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      localStorage.setItem('naivra-products', JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2 style={{ marginBottom: '2rem' }}>Admin Dashboard</h2>
      
      {/* Products Section */}
      <div className="admin-section">
        <div className="section-header">
          <h3>Products Management</h3>
          <Link 
            to="/add-product" 
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            + Add New Product
          </Link>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '12px 8px', borderBottom: '2px solid #edf2f7' }}>Image</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', borderBottom: '2px solid #edf2f7' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', borderBottom: '2px solid #edf2f7' }}>Price</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', borderBottom: '2px solid #edf2f7' }}>Seller</th>
                <th style={{ textAlign: 'left', padding: '12px 8px', borderBottom: '2px solid #edf2f7' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td style={{ padding: '12px 8px', borderBottom: '1px solid #edf2f7' }}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} 
                    />
                  </td>
                  <td style={{ padding: '12px 8px', borderBottom: '1px solid #edf2f7' }}>{product.name}</td>
                  <td style={{ padding: '12px 8px', borderBottom: '1px solid #edf2f7' }}>${product.price}</td>
                  <td style={{ padding: '12px 8px', borderBottom: '1px solid #edf2f7' }}>
                    {sellers.find(s => s.id === product.sellerId)?.businessName || 'Admin'}
                  </td>
                  <td style={{ padding: '12px 8px', borderBottom: '1px solid #edf2f7' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link
                        to={`/edit-product/${product.id}`}
                        style={{
                          backgroundColor: '#2196F3',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontSize: '12px'
                        }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        style={{
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Seller Form */}
      <div className="add-seller-section admin-section">
        <h3>Add New Seller</h3>
        <form onSubmit={handleAddSeller} className="add-seller-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={newSeller.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={newSeller.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="businessName">Business Name</label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={newSeller.businessName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={newSeller.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit">Add Seller</button>
        </form>
      </div>

      {/* Sellers List */}
      <div className="sellers-list">
        <h3>Registered Sellers</h3>
        <table>
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Status</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map(seller => (
              <tr key={seller.id}>
                <td>{seller.businessName}</td>
                <td>{seller.username}</td>
                <td>{seller.email}</td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    backgroundColor: seller.status === 'active' ? '#4CAF50' : '#f44336',
                    color: 'white'
                  }}>
                    {seller.status}
                  </span>
                </td>
                <td>{new Date(seller.dateAdded).toLocaleDateString()}</td>
                <td style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => toggleSellerStatus(seller.id)}
                    style={{
                      backgroundColor: seller.status === 'active' ? '#ff9800' : '#4CAF50',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {seller.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this seller? This action cannot be undone.')) {
                        const updatedSellers = sellers.filter(s => s.id !== seller.id);
                        localStorage.setItem('naivra-sellers', JSON.stringify(updatedSellers));
                        setSellers(updatedSellers);
                        
                        // Also delete all products from this seller
                        const products = JSON.parse(localStorage.getItem('naivra-products') || '[]');
                        const updatedProducts = products.filter(p => p.sellerId !== seller.id);
                        localStorage.setItem('naivra-products', JSON.stringify(updatedProducts));
                      }
                    }}
                    style={{
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
