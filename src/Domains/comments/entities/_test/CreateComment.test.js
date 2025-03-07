const CreateComment = require("../CreateComment");

describe("CreateComment", () => {
  it("should throw error when payload does not contain needed property", () => {
    const invalidPayloads = [
      {}, // missing content
      { content: "" }, // empty content
    ];

    invalidPayloads.forEach((payload) => {
      expect(() => new CreateComment(payload)).toThrowError(
        "CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
      );
    });
  });

  it("should create an instance when valid payload is provided", () => {
    const validPayload = { content: "This is a comment" };

    const createComment = new CreateComment(validPayload);

    expect(createComment).toBeInstanceOf(CreateComment);
    expect(createComment.content).toBe(validPayload.content);
  });
});
