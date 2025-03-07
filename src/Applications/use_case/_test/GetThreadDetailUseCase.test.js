const GetThreadDetailUseCase = require("../GetThreadDetailUseCase");
const DetailThread = require("../../../Domains/threads/entities/DetailThread");
const DetailComment = require("../../../Domains/comments/entities/DetailComment");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");

describe("GetThreadDetailUseCase", () => {
  it("should orchestrate the get thread detail action correctly", async () => {
    // Arrange
    const mockThreadDetail = {
      id: "thread-123",
      title: "A thread",
      body: "A long thread",
      date: "2023-09-07T00:00:00.000Z",
      username: "foobar",
    };

    const mockComments = [
      {
        id: "comment-1",
        username: "johndoe",
        date: "2023-09-07T00:00:00.000Z",
        content: "a comment",
        is_delete: false,
      },
      {
        id: "comment-2",
        username: "foobar",
        date: "2023-09-08T00:00:00.000Z",
        content: "a deleted comment",
        is_delete: true,
      },
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn().mockResolvedValue({
      id: "thread-123",
      title: "A thread",
      body: "A long thread",
      date: "2023-09-07T00:00:00.000Z",
      username: "foobar",
    });

    mockCommentRepository.fetchCommentsByThread = jest.fn().mockResolvedValue([
      {
        id: "comment-1",
        username: "johndoe",
        date: "2023-09-07T00:00:00.000Z",
        content: "a comment",
        is_delete: false,
      },
      {
        id: "comment-2",
        username: "foobar",
        date: "2023-09-08T00:00:00.000Z",
        content: "a deleted comment",
        is_delete: true,
      },
    ]);

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute("thread-123");

    // Assert
    expect(threadDetail).toStrictEqual(
      new DetailThread({
        id: "thread-123",
        title: "A thread",
        body: "A long thread",
        date: "2023-09-07T00:00:00.000Z",
        username: "foobar",
        comments: [
          new DetailComment({
            id: "comment-1",
            username: "johndoe",
            date: "2023-09-07T00:00:00.000Z",
            content: "a comment",
          }),
          new DetailComment({
            id: "comment-2",
            username: "foobar",
            date: "2023-09-08T00:00:00.000Z",
            content: "**komentar telah dihapus**",
          }),
        ],
      })
    );

    expect(mockThreadRepository.getThreadById).toBeCalledWith("thread-123");
    expect(mockCommentRepository.fetchCommentsByThread).toBeCalledWith(
      "thread-123"
    );

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledTimes(1);
    expect(mockCommentRepository.fetchCommentsByThread).toHaveBeenCalledTimes(
      1
    );
  });
});
