// Domains/threads/errors/CommentValidationError.js

class CommentValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "CommentValidationError"; // Untuk memudahkan identifikasi error
    this.isDomainError = true; // Menandakan ini adalah error domain
  }
}

module.exports = CommentValidationError;
