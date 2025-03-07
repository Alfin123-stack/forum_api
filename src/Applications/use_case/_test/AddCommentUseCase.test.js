const AddCommentUseCase = require("../AddCommentUseCase");
const CreateComment = require("../../../Domains/comments/entities/CreateComment");
const CommentValidationError = require("../../../Domains/comments/errors/CommentValidationError");

describe("AddCommentUseCase", () => {
  it("should execute the comment addition process as expected", async () => {
    // Arrange
    const commentPayload = { content: "A comment" };

    // Mocking with neutral values, returning expected entity instead of anonymous object
    const mockThreadRepository = {
      verifyAvailableThread: jest.fn(() => Promise.resolve()),
    };
    const mockCommentRepository = {
      createComment: jest.fn((userId, threadId, createComment) =>
        Promise.resolve(
          new CreateComment({
            id: "generated-id",
            content: createComment.content,
            owner: userId,
          })
        )
      ),
    };

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Act
    const createdComment = await addCommentUseCase.execute(
      "user-123",
      "thread-123",
      commentPayload
    );

    // Assert
    expect(createdComment).toEqual(
      new CreateComment({
        id: "generated-id",
        content: "A comment",
        owner: "user-123",
      })
    );
    expect(mockThreadRepository.verifyAvailableThread).toHaveBeenCalledWith(
      "thread-123"
    );
    expect(mockCommentRepository.createComment).toHaveBeenCalledWith(
      "user-123",
      "thread-123",
      new CreateComment({ content: commentPayload.content })
    );
  });

  it("should throw CommentValidationError if content is missing", async () => {
    // Arrange
    const commentPayload = {}; // content is missing
    const mockThreadRepository = { verifyAvailableThread: jest.fn() };
    const mockCommentRepository = { createComment: jest.fn() };

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(
      addCommentUseCase.execute("user-123", "thread-123", commentPayload)
    ).rejects.toThrowError(
      new CommentValidationError(
        "tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada"
      )
    );

    expect(mockThreadRepository.verifyAvailableThread).not.toHaveBeenCalled();
    expect(mockCommentRepository.createComment).not.toHaveBeenCalled();
  });

  it("should throw CommentValidationError if content is not a string", async () => {
    // Arrange
    const commentPayload = { content: 12345 }; // content is not a string
    const mockThreadRepository = { verifyAvailableThread: jest.fn() };
    const mockCommentRepository = { createComment: jest.fn() };

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(
      addCommentUseCase.execute("user-123", "thread-123", commentPayload)
    ).rejects.toThrowError(
      new CommentValidationError("komentar harus berupa string")
    );

    expect(mockThreadRepository.verifyAvailableThread).not.toHaveBeenCalled();
    expect(mockCommentRepository.createComment).not.toHaveBeenCalled();
  });
});
