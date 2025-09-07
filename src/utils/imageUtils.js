const IMGBB_API_KEY = '1bc9c7e99601b2123ee156a6dde9bd8b'; // Replace with your actual ImgBB API key

export const saveImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error?.message || 'Failed to upload image');
    }

    console.log('Upload successful:', data);
    // Return the direct URL of the uploaded image
    return data.data.url;
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error(error.message || 'Failed to upload image. Please try again.');
  }
};

export const getImageUrl = (path) => {
  if (!path) return '';

  // ImgBB returns full URL, so just return as is
  return path;
};
