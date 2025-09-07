import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Check if user is a seller
    const userType = localStorage.getItem('userType');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const sellerId = localStorage.getItem('sellerId');
    
    console.log('SellerDashboard - User Type:', userType);
    console.log('SellerDashboard - Is Logged In:', isLoggedIn);
    console.log('SellerDashboard - Seller ID:', sellerId);
    
    if (!isLoggedIn || userType !== 'seller') {
      console.log('Unauthorized access to SellerDashboard, redirecting to login');
      navigate('/login');
      return;
    }

    // Load only this seller's products
    const allProducts = JSON.parse(localStorage.getItem('naivra-products')) || [];
    console.log('All products:', allProducts);
    const sellerProducts = allProducts.filter(p => p.sellerId === sellerId);
    console.log('Filtered products for seller:', sellerProducts);
    setProducts(sellerProducts);
  }, [navigate]);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Seller Dashboard</h2>
          <p>Total Products Listed: {products.length}</p>
        </div>
        <button 
          onClick={() => navigate('/add-product')}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          + Add New Carpet
        </button>
      </div>
      
      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <p>You haven't added any products yet.</p>
          <button 
            onClick={() => navigate('/add-product')}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Add Your First Carpet
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {products.map(p => (
          <div key={p.id} className="dashboard-product-card" style={{
            border: '1px solid #ddd',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <img src={p.image} alt={p.name} style={{ 
              width: '100%', 
              height: '200px', 
              objectFit: 'cover',
              borderRadius: '4px',
              marginBottom: '1rem'
            }} />
            <h3>{p.name}</h3>
            <p>Price: ${p.price}</p>
            <p>Views: {p.clicks || 0}</p>
            <p>{p.specs}</p>
            <div style={{ marginTop: '1rem' }}>
              <button 
                onClick={() => navigate(`/edit-product/${p.id}`)}
                style={{
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '8px'
                }}
              >
                Edit
              </button>
              <button 
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
                    const updatedProducts = products.filter(product => product.id !== p.id);
                    localStorage.setItem('naivra-products', JSON.stringify(updatedProducts));
                    setProducts(updatedProducts);
                  }
                }}
                style={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
