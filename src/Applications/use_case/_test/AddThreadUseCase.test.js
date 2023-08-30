const NewThreadPayload = require('../../../Domains/threads/entities/NewThreadPayload');
const NewThreadResponse = require('../../../Domains/threads/entities/NewThreadResponse');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = new NewThreadPayload({
      title: 'title',
      body: 'body',
    });
    const userId = 'userId';
    const mockThreadResponse = new NewThreadResponse({
      title: useCasePayload.title,
      id: '1',
      owner: userId,
    });
    const mockThreadPayload = {
      ...useCasePayload,
      userId,
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThreadResponse));

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const thread = await addThreadUseCase.execute(useCasePayload, userId);

    // Assert
    expect(mockThreadRepository.addThread).toBeCalledWith(mockThreadPayload);
    expect(thread).toEqual(mockThreadResponse);
  });
});
