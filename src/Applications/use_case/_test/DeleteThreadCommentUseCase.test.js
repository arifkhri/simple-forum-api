const NewThreadComment = require('../../../Domains/threadscomment/entities/NewThreadComment');
const ThreadCommentRepository = require('../../../Domains/threadscomment/ThreadCommentRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const DeleteThreadCommentUseCase = require('../DeleteThreadCommentUseCase');

describe('DeleteThreadCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the delete thread comment action correctly', async () => {
    const useCaseParams = {
      commentId: 'thread-comment-1',
      threadId: 'thread-id',
    };

    const useCaseHeaders = {
      authorization: 'accessToken',
    };

    /** creating dependency of use case */
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    /** mocking needed function */
    mockThreadCommentRepository.getThreadComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.delThreadComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve(useCaseHeaders.authorization));
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve(useCaseHeaders.authorization));

    /** creating use case instance */
    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    await deleteThreadCommentUseCase.execute(useCaseParams, useCaseHeaders);

    // Assert
    expect(mockThreadCommentRepository.delThreadComment).toBeCalledWith({
      ...useCaseParams,
      userId: '',
    });
    expect(mockThreadCommentRepository.getThreadComment).toBeCalledWith(useCaseParams.commentId);
    expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(useCaseHeaders.authorization);
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(useCaseHeaders.authorization);
  });
});
