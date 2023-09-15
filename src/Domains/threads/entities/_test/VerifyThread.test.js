const VerifyThread = require('../VerifyThread');

describe('a VerifyThread entities', () => {
  it('should throw error when record response did not meet data type specification', () => {
    // Arrange
    const record = {};

    // Action and Assert
    expect(() => new VerifyThread(record)).toThrowError('VERIFY_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when response inside record did not meet data type specification', () => {
    // Arrange
    const record = {
      id: 1,
    };

    // Action and Assert
    expect(() => new VerifyThread(record)).toThrowError('VERIFY_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should return VerifyThread object correctly', () => {
    // Arrange
    const record = {
      id: '1',
    };

    const threadComment = new VerifyThread(record);

    // Assert
    expect(threadComment).toEqual(record);
  });
});
