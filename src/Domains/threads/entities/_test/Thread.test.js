const Thread = require("../Thread"); // Pastikan path-nya benar

describe("a Thread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      title: "Thread Title",
      owner: "user-123",
    };

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError(
      "THREAD.THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: 123, // id seharusnya string
      title: "Thread Title",
      owner: {},
    };

    // Action and Assert
    expect(() => new Thread(payload)).toThrowError(
      "THREAD.THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create Thread object correctly", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "Thread Title",
      owner: "user-123",
    };

    // Action
    const thread = new Thread(payload);

    // Assert
    expect(thread.id).toEqual(payload.id);
    expect(thread.title).toEqual(payload.title);
    expect(thread.owner).toEqual(payload.owner);
  });
});
