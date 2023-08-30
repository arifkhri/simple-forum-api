const ThreadCommentRepository = require('../../../Domains/threadscomment/ThreadCommentRepository');
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

    const userId = 'userId';

    const deletePayload = {
      ...useCaseParams,
      userId,
    };

    /** creating dependency of use case */
    const mockThreadCommentRepository = new ThreadCommentRepository();
    /** mocking needed function */
    mockThreadCommentRepository.verifyThreadCommentAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve(useCaseParams.commentId));
    mockThreadCommentRepository.delThreadComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action
    await deleteThreadCommentUseCase.execute(useCaseParams, userId);

    // Assert
    expect(mockThreadCommentRepository.delThreadComment).toBeCalledWith(deletePayload);
    expect(mockThreadCommentRepository.verifyThreadCommentAvailability).toBeCalledWith(useCaseParams.commentId);
  });
});
