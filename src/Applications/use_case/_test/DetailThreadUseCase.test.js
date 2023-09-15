const ThreadCommentRepository = require('../../../Domains/threadscomment/ThreadCommentRepository');
const ThreadComment = require('../../../Domains/threadscomment/entities/ThreadComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailThreadUseCase = require('../DetailThreadUseCase');

describe('DetailThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the detail thread comment action correctly', async () => {
    const useCaseParams = {
      threadId: 'thread-id',
    };

    const mockThread = new DetailThread({
      id: 'id1',
      title: 'title',
      body: 'body',
      date: 'date',
      username: 'username',
    });

    const mockComments = new ThreadComment([{
      id: 'id-comment-1',
      content: 'content comment',
      created_at: 'date comment',
      username: 'username comment',
      deleted_at: null,
    }]);

    const mockDetailThreadResponse = {
      ...mockThread,
      ...mockComments,
    };

    /** creating dependency of use case */
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockThreadRepository = new ThreadRepository();
    /** mocking needed function */
    mockThreadCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(new ThreadComment([{
        id: 'id-comment-1',
        content: 'content comment',
        created_at: 'date comment',
        username: 'username comment',
        deleted_at: null,
      }])));
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve(new DetailThread({
        id: 'id1',
        title: 'title',
        body: 'body',
        date: 'date',
        username: 'username',
      })));

    /** creating use case instance */
    const detailThreadUseCase = new DetailThreadUseCase({
      threadCommentRepository: mockThreadCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const thread = await detailThreadUseCase.execute(useCaseParams);

    // Assert
    expect(thread).toEqual(mockDetailThreadResponse);
    expect(mockThreadCommentRepository.getCommentByThreadId).toBeCalledWith(useCaseParams.threadId);
    expect(mockThreadRepository.getThread).toBeCalledWith(useCaseParams.threadId);
  });
});
