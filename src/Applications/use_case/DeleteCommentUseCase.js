class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, useCaseParams) {
    const { threadId, commentId } = useCaseParams;
    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.isCommentExists(commentId, threadId);
    await this._commentRepository.checkCommentAuthor(commentId, userId);

    return this._commentRepository.removeComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
