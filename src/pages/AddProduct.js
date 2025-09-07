import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveImage } from '../utils/imageUtils';

const AddProduct = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is a seller or admin
    const userType = localStorage.getItem('userType');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn || (userType !== 'seller' && userType !== 'admin')) {
      alert('Only sellers and admins can add products');
      navigate('/login');
      return;
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    specs: '',
    description: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [imagePreview, setImagePreview] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageChange = async (e) => {
    const input = e.target;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      setSelectedFile(file);
      setUploadError(null);
      
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      await uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    setIsUploadingImage(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Save image and get path
      const imagePath = await saveImage(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setFormData(prev => ({
        ...prev,
        image: imagePath
      }));
      
      setTimeout(() => {
        setIsUploadingImage(false);
        setUploadProgress(0);
      }, 500);

    } catch (error) {
      console.error('Error handling image:', error);
      setUploadError('Failed to upload image. Please try again.');
      setIsUploadingImage(false);
      setUploadProgress(0);
    }
  };

  const handleRetryUpload = () => {
    if (selectedFile) {
      uploadImage(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUploadingImage) {
      alert('Please wait for the image to finish uploading');
      return;
    }

    const products = JSON.parse(localStorage.getItem('naivra-products') || '[]');
    const newProduct = {
      id: products.length + 1,
      ...formData,
      price: parseFloat(formData.price),
      sellerId: localStorage.getItem('sellerId'),
      dateAdded: new Date().toISOString()
    };
    products.push(newProduct);
    localStorage.setItem('naivra-products', JSON.stringify(products));
    alert('Carpet added successfully!');
    navigate('/');
  };

  return (
    <div className="add-product-container">
      <header>Add New Carpet</header>
      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-group">
          <label htmlFor="name">Carpet Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Elegant Persian Carpet"
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
            placeholder="e.g., 1200"
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
            placeholder="e.g., Handmade, Wool, 8x10ft"
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
            placeholder="Detailed description of the carpet..."
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Product Image</label>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginBottom: '0.5rem' }}
            />
          </div>
          {imagePreview && (
            <div style={{ marginTop: '1rem' }}>
              <p>Preview:</p>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ 
                  maxWidth: '200px', 
                  maxHeight: '200px', 
                  objectFit: 'contain',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '4px',
                  opacity: isUploadingImage ? 0.7 : 1
                }} 
              />
            </div>
          )}
          
          {isUploadingImage && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ 
                width: '100%', 
                height: '4px', 
                backgroundColor: '#edf2f7',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${uploadProgress}%`,
                  height: '100%',
                  backgroundColor: '#2c5282',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>
                Uploading image... {uploadProgress}%
              </p>
            </div>
          )}

          {uploadError && (
            <div style={{ marginTop: '1rem' }}>
              <p style={{ color: '#e53e3e', marginBottom: '0.5rem' }}>{uploadError}</p>
              <button
                type="button"
                onClick={handleRetryUpload}
                style={{
                  backgroundColor: '#2c5282',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Retry Upload
              </button>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="submit-button">
            Add Carpet
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
