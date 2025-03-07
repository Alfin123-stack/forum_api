// Domains/threads/errors/ThreadValidationError.js

class ThreadValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ThreadValidationError"; // Untuk memudahkan identifikasi error
    this.isDomainError = true; // Menandakan ini adalah error domain
  }
}

module.exports = ThreadValidationError;
