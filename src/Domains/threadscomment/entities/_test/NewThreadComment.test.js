const NewThreadComment = require('../NewThreadComment');

describe('a NewThreadComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new NewThreadComment(payload)).toThrowError('NEW_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should create NewThreadComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'bisa ko',
    };

    // Action
    const { content } = new NewThreadComment(payload);

    // Assert
    expect(content).toEqual(payload.content);
  });
});
