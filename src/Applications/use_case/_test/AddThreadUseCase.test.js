const NewThreadPayload = require('../../../Domains/threads/entities/NewThreadPayload');
const NewThreadResponse = require('../../../Domains/threads/entities/NewThreadResponse');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'title',
      body: 'body',
    };

    const useCaseHeaders = {
      authorization: 'accessToken',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve({
        title: 'title',
        id: '1',
        owner: '1',
      }));
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve(useCaseHeaders.authorization));
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve(useCaseHeaders.authorization));

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const threadComment = await addThreadUseCase.execute(useCasePayload, useCaseHeaders);

    // Assert
    expect(mockThreadRepository.addThread).toBeCalledWith({
      title: 'title',
      body: 'body',
      userId: '',
    });
    expect(threadComment).toEqual({
      title: 'title',
      id: '1',
      owner: '1',
    });
    expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(useCaseHeaders.authorization);
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(useCaseHeaders.authorization);
  });
});
