/**
 * Form Validation Utilities for Indian Formats
 * - Strict Indian Mobile: 10 digits starting with 6, 7, 8, or 9
 * - Strict Email format checking with real-time feedback
 * - Name and required text field verification
 */

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * Normalizes Indian mobile number input by stripping +91, leading 0, spaces, dashes, parentheses
 */
export function normalizeIndianMobile(raw: string): string {
  // Remove all non-digit characters except leading +
  let cleaned = raw.replace(/[^\d+]/g, '');
  
  // If starts with +91, remove it
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.slice(1);
  }
  
  // Strip any remaining non-digits
  return cleaned.replace(/\D/g, '');
}

/**
 * Validates Indian Mobile Numbers
 * Strictly requires 10 digits starting with 6, 7, 8, or 9
 */
export function validateIndianMobile(raw: string): ValidationResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { isValid: false, message: 'Mobile number is required' };
  }

  const cleaned = normalizeIndianMobile(trimmed);

  if (cleaned.length === 0) {
    return { isValid: false, message: 'Please enter a valid mobile number' };
  }

  // Check first digit
  const firstDigit = cleaned[0];
  if (!['6', '7', '8', '9'].includes(firstDigit)) {
    return { 
      isValid: false, 
      message: 'Indian mobile numbers must start with 6, 7, 8, or 9' 
    };
  }

  if (cleaned.length < 10) {
    return { 
      isValid: false, 
      message: `Mobile number incomplete (${cleaned.length}/10 digits)` 
    };
  }

  if (cleaned.length > 10) {
    return { 
      isValid: false, 
      message: 'Mobile number cannot exceed 10 digits' 
    };
  }

  const isValid = /^[6-9]\d{9}$/.test(cleaned);
  return {
    isValid,
    message: isValid ? '' : 'Please enter a valid 10-digit Indian mobile number',
  };
}

/**
 * Validates Email Address with actionable real-time feedback
 */
export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();
  if (!trimmed) {
    return { isValid: false, message: 'Email address is required' };
  }

  if (/\s/.test(trimmed)) {
    return { isValid: false, message: 'Email cannot contain spaces' };
  }

  if (!trimmed.includes('@')) {
    return { isValid: false, message: "Email must include '@' (e.g. name@domain.com)" };
  }

  const parts = trimmed.split('@');
  if (!parts[0]) {
    return { isValid: false, message: "Missing username before '@'" };
  }
  if (parts.length < 2 || !parts[1]) {
    return { isValid: false, message: "Enter domain after '@' (e.g. gmail.com, outfit.in)" };
  }
  if (parts.length > 2) {
    return { isValid: false, message: "Email cannot contain multiple '@' symbols" };
  }

  const domain = parts[1];
  if (!domain.includes('.')) {
    return { isValid: false, message: "Domain must include '.' (e.g. gmail.com, outfit.in)" };
  }

  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) {
    return { isValid: false, message: 'Invalid domain extension (e.g. .com, .in, .org)' };
  }

  // RFC-compliant practical regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValid = emailRegex.test(trimmed);

  return {
    isValid,
    message: isValid ? '' : 'Please enter a valid email address (e.g. name@domain.com)',
  };
}

/**
 * Validates Full Name
 */
export function validateName(name: string): ValidationResult {
  const trimmed = name.trim();
  if (!trimmed) {
    return { isValid: false, message: 'Full name is required' };
  }
  if (trimmed.length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters' };
  }
  if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) {
    return { isValid: false, message: 'Name should contain letters only' };
  }
  return { isValid: true, message: '' };
}

/**
 * Validates Organization
 */
export function validateOrganization(org: string): ValidationResult {
  const trimmed = org.trim();
  if (!trimmed) {
    return { isValid: false, message: 'Organization / Facility name is required' };
  }
  if (trimmed.length < 2) {
    return { isValid: false, message: 'Organization must be at least 2 characters' };
  }
  return { isValid: true, message: '' };
}

/**
 * Validates Requirement message
 */
export function validateMessage(msg: string): ValidationResult {
  const trimmed = msg.trim();
  if (!trimmed) {
    return { isValid: false, message: 'Message / Project brief is required' };
  }
  if (trimmed.length < 5) {
    return { isValid: false, message: 'Please provide at least a brief sentence (min 5 chars)' };
  }
  return { isValid: true, message: '' };
}
