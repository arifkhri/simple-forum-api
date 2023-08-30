const DetailThread = require('../DetailThread');

describe('a DetailThread entities', () => {
  it('should throw error when response did not contain needed property', () => {
    // Arrange
    const response = {};

    // Action and Assert
    expect(() => new DetailThread(response)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const response = {
      id: 1,
      title: '3 Periode',
      body: 'just body',
      date: '1 april 2015',
      username: 'username',
    };

    // Action and Assert
    expect(() => new DetailThread(response)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should get DetailThread object correctly', () => {
    // Arrange
    const response = {
      title: '3 Periode',
      date: '1 april 2015',
      body: 'just body',
      id: 'asdbde',
      username: 'bapak',
    };

    // Action
    const detailThread = new DetailThread(response);

    // Assert
    expect(detailThread.title).toEqual(response.title);
    expect(detailThread.date).toEqual(response.date);
    expect(detailThread.body).toEqual(response.body);
    expect(detailThread.username).toEqual(response.username);
    expect(detailThread.id).toEqual(response.id);
  });
});
