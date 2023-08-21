const NewThreadResponse = require('../NewThreadResponse');

describe('a NewThreadResponse entities', () => {
  it('should throw error when response did not contain needed property', () => {
    // Arrange
    const response = {
      title: '3 Periode',
    };

    // Action and Assert
    expect(() => new NewThreadResponse(response)).toThrowError('NEW_THREAD_RESPONSE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when response did not meet data type specification', () => {
    // Arrange
    const response = {
      title: '3 Periode',
      owner: {},
      id: 'asdbde',
    };

    // Action and Assert
    expect(() => new NewThreadResponse(response)).toThrowError('NEW_THREAD_RESPONSE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should return NewThreadResponse object correctly', () => {
    // Arrange
    const response = {
      title: '3 Periode',
      owner: 'just owner',
      id: 'asdbde',
    };

    // Action
    const newThreadResponse = new NewThreadResponse(response);

    // Assert
    expect(newThreadResponse.title).toEqual(response.title);
    expect(newThreadResponse.owner).toEqual(response.owner);
    expect(newThreadResponse.id).toEqual(response.id);
  });
});
