// src/utils/validators.js
// Validate a number field
export const validateNumber = (value, options = {}) => {
  const { min, max, required = false } = options;
  
  // Check if it's required and empty
  if (required && (value === '' || value === null || value === undefined)) {
    return 'This field is required';
  }
  
  // If it's not required and empty, it's valid
  if (!required && (value === '' || value === null || value === undefined)) {
    return null;
  }
  
  // Check if it's a valid number
  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return 'Please enter a valid number';
  }
  
  // Check minimum value
  if (min !== undefined && numValue < min) {
    return `Value must be at least ${min}`;
  }
  
  // Check maximum value
  if (max !== undefined && numValue > max) {
    return `Value must be at most ${max}`;
  }
  
  return null; // Valid
};

// Validate a text field
export const validateText = (value, options = {}) => {
  const { required = false, minLength, maxLength } = options;
  
  // Check if it's required and empty
  if (required && (!value || value.trim() === '')) {
    return 'This field is required';
  }
  
  // If it's not required and empty, it's valid
  if (!required && (!value || value.trim() === '')) {
    return null;
  }
  
  // Check minimum length
  if (minLength !== undefined && value.length < minLength) {
    return `Text must be at least ${minLength} characters`;
  }
  
  // Check maximum length
  if (maxLength !== undefined && value.length > maxLength) {
    return `Text must be at most ${maxLength} characters`;
  }
  
  return null; // Valid
};

// Validate a date field
export const validateDate = (value, options = {}) => {
  const { required = false, minDate, maxDate } = options;
  
  // Check if it's required and empty
  if (required && !value) {
    return 'This field is required';
  }
  
  // If it's not required and empty, it's valid
  if (!required && !value) {
    return null;
  }
  
  // Try to parse the date
  try {
    const dateValue = new Date(value);
    
    // Check if it's a valid date
    if (isNaN(dateValue.getTime())) {
      return 'Please enter a valid date';
    }
    
    // Check minimum date
    if (minDate !== undefined) {
      const minDateValue = new Date(minDate);
      if (dateValue < minDateValue) {
        return `Date must be after ${minDateValue.toLocaleDateString()}`;
      }
    }
    
    // Check maximum date
    if (maxDate !== undefined) {
      const maxDateValue = new Date(maxDate);
      if (dateValue > maxDateValue) {
        return `Date must be before ${maxDateValue.toLocaleDateString()}`;
      }
    }
    
    return null; // Valid
  } catch (error) {
    return 'Please enter a valid date';
  }
};

// Validate file size
export const validateFileSize = (file, maxSizeMB = 5) => {
  if (!file) return null;
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  
  if (file.size > maxSizeBytes) {
    return `File size must be less than ${maxSizeMB} MB`;
  }
  
  return null; // Valid
};

// Validate image dimensions
export const validateImageDimensions = async (file, options = {}) => {
  const { minWidth, minHeight, maxWidth, maxHeight } = options;
  
  if (!file) return null;
  
  // Check if it's an image
  if (!file.type.startsWith('image/')) {
    return 'File must be an image';
  }
  
  // Create a promise that resolves with the image dimensions
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Check minimum width
      if (minWidth !== undefined && img.width < minWidth) {
        resolve(`Image width must be at least ${minWidth}px`);
        return;
      }
      
      // Check minimum height
      if (minHeight !== undefined && img.height < minHeight) {
        resolve(`Image height must be at least ${minHeight}px`);
        return;
      }
      
      // Check maximum width
      if (maxWidth !== undefined && img.width > maxWidth) {
        resolve(`Image width must be at most ${maxWidth}px`);
        return;
      }
      
      // Check maximum height
      if (maxHeight !== undefined && img.height > maxHeight) {
        resolve(`Image height must be at most ${maxHeight}px`);
        return;
      }
      
      resolve(null); // Valid
    };
    
    img.onerror = () => {
      resolve('Failed to load image');
    };
    
    img.src = URL.createObjectURL(file);
  });
};