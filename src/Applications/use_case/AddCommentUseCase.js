const CreateComment = require("../../Domains/comments/entities/CreateComment");
const CommentValidationError = require("../../Domains/comments/errors/CommentValidationError");

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  // Private function to validate the payload
  _verifyPayload(payload) {
    const { content } = payload;

    // Check if content is missing
    if (!content) {
      throw new CommentValidationError(
        "tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada"
      );
    }

    // Check if content is not a string
    if (typeof content !== "string") {
      throw new CommentValidationError("komentar harus berupa string");
    }
  }

  // Main execution function
  async execute(userId, threadId, useCasePayload) {
    // Validate the payload
    this._verifyPayload(useCasePayload);

    // Verify if the thread exists
    await this._threadRepository.verifyAvailableThread(threadId);

    // Create the comment entity
    const createComment = new CreateComment(useCasePayload);

    // Add the comment to the repository
    return this._commentRepository.createComment(
      userId,
      threadId,
      createComment
    );
  }
}

module.exports = AddCommentUseCase;
