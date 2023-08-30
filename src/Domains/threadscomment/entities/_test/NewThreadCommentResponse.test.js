const NewThreadCommentResponse = require('../NewThreadCommentResponse');

describe('a NewThreadCommentResponse entities', () => {
  it('should throw error when response did not contain needed property', () => {
    // Arrange
    const response = {};

    // Action and Assert
    expect(() => new NewThreadCommentResponse(response)).toThrowError('NEW_THREAD_COMMENT_RESPONSE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when response did not meet data type specification', () => {
    // Arrange
    const response = {
      content: 1234,
      id: 'id',
      owner: 'owner',
    };

    // Action and Assert
    expect(() => new NewThreadCommentResponse(response)).toThrowError('NEW_THREAD_COMMENT_RESPONSE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThreadCommentResponse object correctly', () => {
    // Arrange
    const response = {
      content: 'hanya content',
      id: 'id123',
      owner: 'owner',
    };

    // Action
    const { content, id, owner } = new NewThreadCommentResponse(response);

    // Assert
    expect(content).toEqual(response.content);
    expect(id).toEqual(response.id);
    expect(owner).toEqual(response.owner);
  });
});
