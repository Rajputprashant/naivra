import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  const [sellerName, setSellerName] = useState('');

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem('naivra-products') || '[]');
    const sellers = JSON.parse(localStorage.getItem('naivra-sellers') || '[]');
    const found = products.find(p => p.id === parseInt(id));
    
    if (found) {
      found.clicks = (found.clicks || 0) + 1;
      const updatedProducts = products.map(p => p.id === found.id ? found : p);
      localStorage.setItem('naivra-products', JSON.stringify(updatedProducts));
      setProduct(found);

      // Get seller information
      const seller = sellers.find(s => s.id === found.sellerId);
      if (seller) {
        setSellerName(seller.businessName);
      }
    }
  }, [id]);

  if (!product) {
    return (
      <div className="product-details-container">
        <h2>Product not found</h2>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="product-details-container">
      <div className="product-details">
        <div className="product-image">
          <img src={getImageUrl(product.image)} alt={product.name} />
        </div>
        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="price">${product.price}</p>
          <p className="specs">{product.specs}</p>
          <p className="description">{product.description}</p>
          {sellerName && (
            <p style={{ 
              color: '#666', 
              marginTop: '1rem', 
              fontStyle: 'italic',
              borderTop: '1px solid #edf2f7',
              paddingTop: '1rem'
            }}>
              Sold by: {sellerName}
            </p>
          )}
          <button onClick={() => navigate('/')} className="back-button">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
