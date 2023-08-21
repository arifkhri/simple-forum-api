const NewThreadComment = require('../../../Domains/threadscomment/entities/NewThreadComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/threadscomment/ThreadCommentRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const AddThreadCommentUseCase = require('../AddThreadCommentUseCase');

describe('AddThreadCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'dicoding',
    };

    const useCaseParams = {
      threadId: 'thread-1',
    };

    const useCaseHeaders = {
      authorization: 'accessToken',
    };

    /** creating dependency of use case */
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    /** mocking needed function */
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve(useCaseParams.threadId));
    mockThreadCommentRepository.addThreadComment = jest.fn()
      .mockImplementation(() => Promise.resolve({
        content: 'dicoding',
        id: '',
        owner: '',
      }));
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve(useCaseHeaders.authorization));
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve(useCaseHeaders.authorization));

    /** creating use case instance */
    const addThreadCommentUseCase = new AddThreadCommentUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const threadComment = await addThreadCommentUseCase.execute(useCasePayload, useCaseParams, useCaseHeaders);

    // Assert
    expect(mockThreadCommentRepository.addThreadComment).toBeCalledWith({
      ...threadComment,
      owner: '',
      id: '',
      userId: '',
      threadId: useCaseParams.threadId,
    });
    expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(useCaseHeaders.authorization);
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(useCaseHeaders.authorization);
    expect(mockThreadRepository.getThread).toBeCalledWith(useCaseParams.threadId);
  });
});
