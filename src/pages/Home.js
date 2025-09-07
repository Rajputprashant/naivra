import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sellers, setSellers] = useState({});

  useEffect(() => {
    // Load products and sellers from localStorage
    const storedProducts = JSON.parse(localStorage.getItem('naivra-products') || '[]');
    const storedSellers = JSON.parse(localStorage.getItem('naivra-sellers') || '[]');
    
    // Create a map of seller IDs to business names
    const sellerMap = {};
    storedSellers.forEach(seller => {
      if (seller.status === 'active') {
        sellerMap[seller.id] = seller.businessName;
      }
    });
    setSellers(sellerMap);

    // Only keep products from active sellers
    const validProducts = storedProducts.filter(product => 
      product.sellerId && sellerMap[product.sellerId]
    );
    setProducts(validProducts);
  }, []);

  useEffect(() => {
    // Filter products based on search term
    const tempProducts = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.specs.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(tempProducts);
  }, [searchTerm, products]);

  return (
    <div className="home-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
        <div>Naivra</div>
        <Link 
          to="/login" 
          style={{
            backgroundColor: '#2c5282',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '14px'
          }}
        >
          Login
        </Link>
      </header>
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search carpets..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id} className="product-card">
            <img src={getImageUrl(product.image)} alt={product.name} className="product-image" />
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-specs">{product.specs}</p>
              <p className="product-description">{product.description}</p>
              <p className="product-price">${product.price}</p>
              <p className="product-seller" style={{ 
                fontSize: '0.9em', 
                color: '#666', 
                marginTop: '0.5rem',
                fontStyle: 'italic' 
              }}>
                Seller: {sellers[product.sellerId]}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
