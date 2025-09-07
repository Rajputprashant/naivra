export const saveImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('http://localhost:3001/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to upload image');
    }

    if (!data.path) {
      throw new Error('No path received from server');
    }

    console.log('Upload successful:', data);
    return data.path;
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error(error.message || 'Failed to upload image. Please try again.');
  }
};

export const getImageUrl = (path) => {
  if (!path) return '';
  
  // If it's a full URL (e.g., https://...), return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If it's a media path, construct the full URL
  if (path.startsWith('/media/')) {
    return `http://localhost:3001${path}`;
  }
  
  return path;
};
