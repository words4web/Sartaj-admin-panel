export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Strict Japan International: +81 followed by 10 digits
  const phoneRegex = /^\+81\d{10}$/;
  return phoneRegex.test(phone.replace(/\s+/g, "")); // Allow spaces for flexibility but test strict
};
