const VerifyThreadComment = require('../VerifyThreadComment');

describe('a VerifyThreadComment entities', () => {
  it('should throw error when record response did not meet data type specification', () => {
    // Arrange
    const record = {};

    // Action and Assert
    expect(() => new VerifyThreadComment(record)).toThrowError('VERIFY__THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when response inside record did not meet data type specification', () => {
    // Arrange
    const record = {
      id: 1,
    };

    // Action and Assert
    expect(() => new VerifyThreadComment(record)).toThrowError('VERIFY_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should return VerifyThreadComment object correctly', () => {
    // Arrange
    const record = {
      id: '1',
    };

    const threadComment = new VerifyThreadComment(record);

    // Assert
    expect(threadComment).toEqual(record);
  });
});
