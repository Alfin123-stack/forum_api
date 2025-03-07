const DetailThread = require("../DetailThread");

describe("DetailThread entities", () => {
  it("should throw error when payload does not contain needed properties", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "A thread",
      body: "A long thread",
      comments: [],
    };

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError(
      "THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload does not meet data type requirements", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "A thread",
      body: "A long thread",
      date: "2023-09-22T07:19:09.775Z",
      username: 123, // Should be a string, not a number
      comments: "some comments", // Should be an array, not a string
    };

    // Action & Assert
    expect(() => new DetailThread(payload)).toThrowError(
      "THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create DetailThread entities correctly", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "A thread",
      body: "A long thread",
      date: "2023-09-22T07:19:09.775Z",
      username: "dicoding",
      comments: [],
    };

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread).toBeInstanceOf(DetailThread);
    expect(detailThread).toStrictEqual(
      new DetailThread({
        id: "thread-123",
        title: "A thread",
        body: "A long thread",
        date: "2023-09-22T07:19:09.775Z",
        username: "dicoding",
        comments: [],
      })
    );
  });
});
