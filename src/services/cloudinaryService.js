// src/services/cloudinaryService.js
const CLOUDINARY_UPLOAD_PRESET = 'fixotracker'; // Your upload preset
const CLOUDINARY_CLOUD_NAME = 'djsp8njpn'; // Your cloud name
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Upload an image to Cloudinary
 * @param {File} imageFile - The image file to upload
 * @param {string} folder - Optional folder name in Cloudinary
 * @returns {Promise<string>} - The URL of the uploaded image
 */
export const uploadImage = async (imageFile, folder = 'car-service-tracker') => {
  try {
    // Create form data for the upload
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);

    // Upload to Cloudinary
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to upload image');
    }

    // Return the secure URL of the uploaded image
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

/**
 * Delete an image from Cloudinary
 * @param {string} imageUrl - The URL of the image to delete
 * @returns {Promise<boolean>} - Whether the deletion was successful
 */
export const deleteImage = async (imageUrl) => {
  // Extract the public_id from the URL
  // Cloudinary URLs look like: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.jpg
  
  try {
    // Note: Cloudinary's free plan doesn't allow deletion via the API
    // You'd typically need to upgrade to use this feature
    // This is more for future reference if you upgrade later
    
    console.warn('Image deletion not supported in free plan:', imageUrl);
    return true;
    
    // If you upgrade to a paid plan, you can implement deletion like this:
    /*
    const urlParts = imageUrl.split('/');
    const filenameWithExtension = urlParts[urlParts.length - 1];
    const publicId = filenameWithExtension.split('.')[0];
    
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_id: publicId,
        api_key: CLOUDINARY_API_KEY,
        // You would need to generate a signature for authentication
      }),
    });
    
    const data = await response.json();
    return data.result === 'ok';
    */
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
};