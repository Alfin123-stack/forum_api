
const CreateThread = require("../../Domains/threads/entities/CreateThread");
const ThreadValidationError = require("../../Domains/threads/errors/ThreadValidationError");


class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  // Private function to validate the paylo ad
  _verifyPayload(payload) {
    const { title, body } = payload;

    // Check if title or body are missing
    if (!title || !body) {
      throw new ThreadValidationError(
        "tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada"
      );
    }

    // Check if title or body are not of type string
    if (typeof title !== "string" || typeof body !== "string") {
      throw new ThreadValidationError(
        "tidak dapat membuat thread baru karena tipe data tidak sesuai"
      );
    }
  }

  // Main execution function
  async execute(userId, useCasePayload) {
    // Validate the payload
    this._verifyPayload(useCasePayload);

    // Create the thread entity
    const createThread = new CreateThread(useCasePayload);

    // Add the thread to the repository
    return this._threadRepository.addThread(userId, createThread);
  }
}

module.exports = AddThreadUseCase;
