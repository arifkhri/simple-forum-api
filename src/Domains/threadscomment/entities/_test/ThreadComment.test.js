const ThreadComment = require('../ThreadComment');

describe('a ThreadComment entities', () => {
  it('should throw error when response did not meet data type specification', () => {
    // Arrange
    const rows = {};

    // Action and Assert
    expect(() => new ThreadComment(rows)).toThrowError('THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create ThreadComment object correctly', () => {
    // Arrange
    const rows = [{
      id: '1',
      content: 'test',
      date: '2019-01-01 00:00:00',
      username: 'rahmat',
    }];

    // Action
    const { comments } = new ThreadComment(rows);

    // Assert
    expect(comments).toContainEqual(rows[0]);
  });
});
