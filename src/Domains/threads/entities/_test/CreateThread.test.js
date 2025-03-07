const CreateThread = require("../CreateThread");

describe("a CreateThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      title: "Thread Title",
    };

    // Action and Assert
    expect(() => new CreateThread(payload)).toThrowError(
      "CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      title: 123,
      body: true,
    };

    // Action and Assert
    expect(() => new CreateThread(payload)).toThrowError(
      "CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw error when title contains more than 50 characters", () => {
    // Arrange
    const payload = {
      title:
        "This title is way too long and exceeds the limit of fifty characters, definitely",
      body: "Thread body content",
    };

    // Action and Assert
    expect(() => new CreateThread(payload)).toThrowError(
      "CREATE_THREAD.TITLE_LIMIT_CHAR"
    );
  });

  it("should throw error when title contains restricted characters", () => {
    // Arrange
    const payload = {
      title: "Invalid title with @ symbol",
      body: "Thread body content",
    };

    // Action and Assert
    expect(() => new CreateThread(payload)).toThrowError(
      "CREATE_THREAD.TITLE_CONTAIN_RESTRICTED_CHARACTER"
    );
  });

  it("should create CreateThread object correctly", () => {
    // Arrange
    const payload = {
      title: "ValidTitle",
      body: "Valid body content for the thread.",
    };

    // Action
    const { title, body } = new CreateThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
