import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadImageToFirebase, saveProductToFirestore } from '../services/firebaseService';

const AddProduct = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || (userType !== 'seller' && userType !== 'admin')) {
      alert('Only sellers and admins can add products');
      navigate('/login');
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    specs: '',
    description: '',
    image: ''
  });

  const [imagePreview, setImagePreview] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);

      try {
        setIsUploadingImage(true);
        setUploadProgress(0);
        const url = await uploadImageToFirebase(file, (progress) => {
          setUploadProgress(progress);
        });
        setFormData(prev => ({ ...prev, image: url }));
        setIsUploadingImage(false);
      } catch (error) {
        console.error('Upload failed', error);
        setUploadError('Image upload failed. Please try again.');
        setIsUploadingImage(false);
      }
    }
  };

  const handleRetryUpload = () => {
    if (selectedFile) {
      handleImageChange({ target: { files: [selectedFile] } });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUploadingImage) {
      alert('Please wait for image upload to complete');
      return;
    }
    try {
      const product = {
        ...formData,
        price: parseFloat(formData.price),
        sellerId: localStorage.getItem('sellerId'),
        dateAdded: new Date().toISOString()
      };
      await saveProductToFirestore(product);
      alert('Carpet added successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to add carpet. Please try again.');
    }
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
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && 
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{ maxWidth: 200, maxHeight: 200, objectFit: 'contain' }} 
            />
          }
          {isUploadingImage && <p>Uploading Image... {uploadProgress}%</p>}
          {uploadError && (
            <>
              <p style={{ color: 'red' }}>{uploadError}</p>
              <button type="button" onClick={handleRetryUpload}>Retry Upload</button>
            </>
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
