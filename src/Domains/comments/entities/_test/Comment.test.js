const Comment = require('../Comment');

describe('Comment', () => {
  it('should throw error when payload does not contain needed property', () => {
    const invalidPayloads = [
      { id: 'comment-1', content: 'This is a comment' }, // missing owner
      { id: 'comment-1', owner: 'user-1' }, // missing content
      { content: 'This is a comment', owner: 'user-1' }, // missing id
    ];

    invalidPayloads.forEach((payload) => {
      expect(() => new Comment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });
  });

  it('should throw error when payload does not meet data type specification', () => {
    const invalidPayloads = [
      { id: 1, content: 'This is a comment', owner: 'user-1' }, // id is not a string
      { id: 'comment-1', content: 12345, owner: 'user-1' }, // content is not a string
      { id: 'comment-1', content: 'This is a comment', owner: 12345 }, // owner is not a string
    ];

    invalidPayloads.forEach((payload) => {
      expect(() => new Comment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
  });

  it('should create comment instance when valid payload is provided', () => {
    const validPayload = {
      id: 'comment-1',
      content: 'This is a comment',
      owner: 'user-1',
    };

    const comment = new Comment(validPayload);

    expect(comment).toBeInstanceOf(Comment);
    expect(comment.id).toBe(validPayload.id);
    expect(comment.content).toBe(validPayload.content);
    expect(comment.owner).toBe(validPayload.owner);
  });
});
