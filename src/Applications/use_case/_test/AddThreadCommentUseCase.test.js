const NewThreadCommentResponse = require('../../../Domains/threadscomment/entities/NewThreadCommentResponse');
const NewThreadCommentPayload = require('../../../Domains/threadscomment/entities/NewThreadCommentPayload');
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
    const useCasePayload = new NewThreadCommentPayload({
      content: 'dicoding',
    });
    const useCaseParams = {
      threadId: 'thread-1',
    };
    const userId = 'userId';
    const mockThreadCommentResponse = new NewThreadCommentResponse({
      content: useCasePayload.content,
      id: '1',
      owner: userId,
    });
    const mockThreadCommentPayload = {
      ...useCasePayload,
      userId,
      threadId: useCaseParams.threadId,
    };

    /** creating dependency of use case */
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve(useCaseParams.threadId));
    mockThreadCommentRepository.addThreadComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadCommentResponse));

    /** creating use case instance */
    const addThreadCommentUseCase = new AddThreadCommentUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const threadComment = await addThreadCommentUseCase.execute(useCasePayload, useCaseParams, userId);

    // Assert
    expect(threadComment).toEqual(mockThreadCommentResponse);
    expect(mockThreadCommentRepository.addThreadComment).toBeCalledWith(mockThreadCommentPayload);
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(useCaseParams.threadId);
  });
});
