export const validateEmail = (email) => {
  if (!email || !email.trim()) return 'Email is required';
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email.trim())) return 'Please enter a valid email address';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters long';
  
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[@$!%*?&#]/.test(password);

  if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
    return 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character (e.g., Password123!).';
  }
  return '';
};

export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) return 'Phone number is required';
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone.trim())) return 'Please enter a valid 10-digit mobile number (e.g. 9876543210)';
  return '';
};

export const validateName = (name, label = 'Name') => {
  if (!name || !name.trim()) return `${label} is required`;
  if (name.trim().length < 2) return `${label} must be at least 2 characters long`;
  return '';
};

export const validateDonorRegistration = (formData) => {
  const errors = {};

  const nameError = validateName(formData.name, 'Full Name');
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const phoneError = validatePhone(formData.phone);
  if (phoneError) errors.phone = phoneError;

  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!formData.bloodGroup) {
    errors.bloodGroup = 'Please select a blood group';
  }

  if (!formData.city || !formData.city.trim()) {
    errors.city = 'City is required';
  }

  if (!formData.address || !formData.address.trim()) {
    errors.address = 'Address is required';
  }

  if (!formData.agreeToTerms) {
    errors.agreeToTerms = 'You must accept the Terms and Privacy Policy';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateHospitalRegistration = (formData) => {
  const errors = {};

  const nameError = validateName(formData.name, 'Hospital Name');
  if (nameError) errors.name = nameError;

  const contactError = validateName(formData.contactPerson, 'Contact Person');
  if (contactError) errors.contactPerson = contactError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const phoneError = validatePhone(formData.phone);
  if (phoneError) errors.phone = phoneError;

  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!formData.city || !formData.city.trim()) {
    errors.city = 'City is required';
  }

  if (!formData.address || !formData.address.trim()) {
    errors.address = 'Address is required';
  }

  if (!formData.hospitalLicenseNumber || !formData.hospitalLicenseNumber.trim()) {
    errors.hospitalLicenseNumber = 'License / Registration number is required';
  }

  if (!formData.agreeToTerms) {
    errors.agreeToTerms = 'You must accept the Terms and Privacy Policy';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
