const DetailComment = require("../DetailComment");

describe("DetailComment entities", () => {
  it("should throw error when payload does not contain the needed properties", () => {
    // Arrange
    const payload = {
      id: "123",
      username: "foobar",
    };

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrowError(
      "COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload does not meet data type requirements", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "foobar",
      content: "a comment",
      replies: "some replies", // Invalid type, should be an array
      date: 321, // Invalid type, should be string or object
    };

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrowError(
      "COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create DetailComment entities correctly when not deleted", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "foobar",
      content: "a comment",
      replies: [
        {
          id: "replies-1",
          username: "johndoe",
          content: "a reply",
          date: "2023-09-21T23:59:59.555Z",
        },
      ],
      date: "2023-09-22T07:19:09.775Z",
      likeCount: 0,
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment).toBeInstanceOf(DetailComment);
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.content).toEqual(payload.content);
    expect(detailComment.date).toEqual(payload.date);
  });

  it("should create DetailComment entities correctly when deleted", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "foobar",
      content: "a comment",
      replies: [
        {
          id: "replies-1",
          username: "johndoe",
          content: "a reply",
          date: "2023-09-21T23:59:59.555Z",
        },
      ],
      date: "2023-09-22T07:19:09.775Z",
      likeCount: 0,
      is_delete: true,
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment).toBeInstanceOf(DetailComment);
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.content).toEqual("**komentar telah dihapus**");
    expect(detailComment.date).toEqual(payload.date);
  });
});
