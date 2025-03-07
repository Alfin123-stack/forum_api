const DeleteCommentUseCase = require("../DeleteCommentUseCase");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe("DeleteCommentUseCase", () => {
  it("should orchestrate the process of deleting a comment correctly", async () => {
    // Arrange
    const useCaseParams = {
      threadId: "thread-123",
      commentId: "comment-123",
    };

    // Mocking the dependencies of the use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Mock the necessary repository methods
    mockThreadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve()
    );
    mockCommentRepository.isCommentExists = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkCommentAuthor = jest.fn(() => Promise.resolve());
    mockCommentRepository.removeComment = jest.fn(() => Promise.resolve());

    // Creating the use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action: Execute the use case
    await deleteCommentUseCase.execute("user-123", useCaseParams);

    // Assert: Verify that the required methods were called with the correct arguments
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCaseParams.threadId
    );
    expect(mockCommentRepository.isCommentExists).toHaveBeenCalledWith(
      useCaseParams.commentId,
      useCaseParams.threadId
    );
    expect(mockCommentRepository.checkCommentAuthor).toHaveBeenCalledWith(
      useCaseParams.commentId,
      "user-123"
    );
    expect(mockCommentRepository.removeComment).toHaveBeenCalledWith(
      useCaseParams.commentId
    );
  });

  it("should throw an error if the thread does not exist", async () => {
    // Arrange
    const useCaseParams = {
      threadId: "thread-123",
      commentId: "comment-123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Mock the thread repository to simulate thread not found scenario
    mockThreadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.reject(new Error("THREAD_NOT_FOUND"))
    );

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert: Check that the error is thrown when the thread doesn't exist
    await expect(
      deleteCommentUseCase.execute("user-123", useCaseParams)
    ).rejects.toThrow("THREAD_NOT_FOUND");

    // Verify that the method was called with the correct argument
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCaseParams.threadId
    );
  });

  it("should throw an error if the comment does not exist", async () => {
    // Arrange
    const useCaseParams = {
      threadId: "thread-123",
      commentId: "comment-123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Mock the comment repository to simulate comment not found scenario
    mockThreadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve()
    );
    mockCommentRepository.isCommentExists = jest.fn(() =>
      Promise.reject(new Error("COMMENT_NOT_FOUND"))
    );

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert: Check that the error is thrown when the comment doesn't exist
    await expect(
      deleteCommentUseCase.execute("user-123", useCaseParams)
    ).rejects.toThrow("COMMENT_NOT_FOUND");

    // Verify that the methods were called with the correct arguments
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCaseParams.threadId
    );
    expect(mockCommentRepository.isCommentExists).toHaveBeenCalledWith(
      useCaseParams.commentId,
      useCaseParams.threadId
    );
  });

  it("should throw an error if the comment author does not match the user", async () => {
    // Arrange
    const useCaseParams = {
      threadId: "thread-123",
      commentId: "comment-123",
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // Mocking the required functions
    mockThreadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve()
    );
    mockCommentRepository.isCommentExists = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkCommentAuthor = jest.fn(() =>
      Promise.reject(new Error("UNAUTHORIZED"))
    );

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert: Check that the error is thrown when the comment owner does not match
    await expect(
      deleteCommentUseCase.execute("user-123", useCaseParams)
    ).rejects.toThrow("UNAUTHORIZED");

    // Verify that the methods were called with the correct arguments
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      useCaseParams.threadId
    );
    expect(mockCommentRepository.isCommentExists).toHaveBeenCalledWith(
      useCaseParams.commentId,
      useCaseParams.threadId
    );
    expect(mockCommentRepository.checkCommentAuthor).toHaveBeenCalledWith(
      useCaseParams.commentId,
      "user-123"
    );
  });
});
