const NewThreadCommentPayload = require('../NewThreadCommentPayload');

describe('a NewThreadCommentPayload entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new NewThreadCommentPayload(payload)).toThrowError('NEW_THREAD_COMMENT_PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 1234,
    };

    // Action and Assert
    expect(() => new NewThreadCommentPayload(payload)).toThrowError('NEW_THREAD_COMMENT_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThreadCommentPayload object correctly', () => {
    // Arrange
    const payload = {
      content: 'bisa ko',
    };

    // Action
    const { content } = new NewThreadCommentPayload(payload);

    // Assert
    expect(content).toEqual(payload.content);
  });
});
