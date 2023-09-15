const ThreadComment = require('../ThreadComment');

describe('a ThreadComment entities', () => {
  it('should throw error when rows response did not meet data type specification', () => {
    // Arrange
    const rows = {};

    // Action and Assert
    expect(() => new ThreadComment(rows)).toThrowError('THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when response inside rows did not meet data type specification', () => {
    // Arrange
    const rows = [{
      id: 1,
      content: null,
      created_at: '2019-01-01 00:00:00',
      deleted_at: '2019-01-01 00:00:00',
      username: 'rahmat',
    }];

    // Action and Assert
    expect(() => new ThreadComment(rows)).toThrowError('THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when response did not contain needed property', () => {
    // Arrange
    const rows = [{
      id: '1',
      content: 'test',
      created_at: '2019-01-01 00:00:00',
      username: 'rahmat',
    }];

    // Action and Assert
    expect(() => new ThreadComment(rows)).toThrowError('THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should return ThreadComment with contain deleted comment', () => {
    // Arrange
    const rows = [{
      id: '1',
      content: 'test',
      created_at: '2019-01-01 00:00:00',
      deleted_at: '2019-01-01 00:00:00',
      username: 'rahmat',
    }];

    const rowsWithDeletedComment = {
      id: '1',
      content: '**komentar telah dihapus**',
      date: '2019-01-01 00:00:00',
      username: 'rahmat',
    };

    const { comments } = new ThreadComment(rows);

    // Action and Assert
    expect(comments).toContainEqual(rowsWithDeletedComment);
  });

  it('should return ThreadComment object correctly', () => {
    // Arrange
    const rows = [{
      id: '1',
      content: 'test',
      created_at: '2019-01-01 00:00:00',
      deleted_at: null,
      username: 'rahmat',
    }];

    const { comments: commentsResponse } = new ThreadComment(rows);

    // Action
    const { comments } = new ThreadComment(rows);

    // Assert
    expect(comments).toContainEqual(commentsResponse[0]);
  });
});
