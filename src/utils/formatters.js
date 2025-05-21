// src/utils/formatters.js
import { format, parseISO, differenceInYears } from 'date-fns';

// Format a date to display format
export const formatDate = (date, formatString = 'dd/MM/yyyy') => {
  if (!date) return '';
  
  try {
    // If it's a Firestore timestamp, convert to JS Date
    if (date && typeof date.toDate === 'function') {
      return format(date.toDate(), formatString);
    }
    
    // If it's already a Date object
    if (date instanceof Date) {
      return format(date, formatString);
    }
    
    // If it's an ISO string
    return format(parseISO(date), formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

// Calculate age from a date
export const calculateAge = (date) => {
  if (!date) return '';
  
  try {
    // If it's a Firestore timestamp, convert to JS Date
    if (date && typeof date.toDate === 'function') {
      return differenceInYears(new Date(), date.toDate());
    }
    
    // If it's already a Date object
    if (date instanceof Date) {
      return differenceInYears(new Date(), date);
    }
    
    // If it's an ISO string
    return differenceInYears(new Date(), parseISO(date));
  } catch (error) {
    console.error('Error calculating age:', error);
    return '';
  }
};

// Format fuel consumption (km/l)
export const formatFuelConsumption = (value) => {
  if (!value) return '';
  
  try {
    return `${parseFloat(value).toFixed(1)} km/l`;
  } catch (error) {
    return '';
  }
};

// Format horsepower
export const formatHorsepower = (value) => {
  if (!value) return '';
  
  try {
    return `${parseInt(value, 10)} HP`;
  } catch (error) {
    return '';
  }
};

// Format odometer reading
export const formatOdometer = (value) => {
  if (!value) return '';
  
  try {
    // Format with thousand separators
    return `${parseInt(value, 10).toLocaleString()} km`;
  } catch (error) {
    return '';
  }
};