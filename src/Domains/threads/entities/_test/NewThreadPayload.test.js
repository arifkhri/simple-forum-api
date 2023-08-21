const NewThreadPayload = require('../NewThreadPayload');

describe('a NewThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: '3 Periode',
    };

    // Action and Assert
    expect(() => new NewThreadPayload(payload)).toThrowError('NEW_THREAD_PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: '3 Periode',
      body: 90,
    };

    // Action and Assert
    expect(() => new NewThreadPayload(payload)).toThrowError('NEW_THREAD_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThread object correctly', () => {
    // Arrange
    const payload = {
      title: '3 Periode',
      body: 'Emang iya?',
    };

    // Action
    const newThread = new NewThreadPayload(payload);

    // Assert
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
  });
});
