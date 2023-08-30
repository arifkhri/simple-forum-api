const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NewThreadCommentPayload = require('../../../Domains/threadscomment/entities/NewThreadCommentPayload');
const NewThreadCommentResponse = require('../../../Domains/threadscomment/entities/NewThreadCommentResponse');
const ThreadComment = require('../../../Domains/threadscomment/entities/ThreadComment');
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentTableTestHelper = require('../../../../tests/ThreadCommentTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');

describe('ThreadCommentRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadCommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('getCommentByThreadId function', () => {
    it('should return thread detail correctly', async () => {
      // Arrange
      const threadCommentPayload = new NewThreadCommentPayload({
        content: 'hanya',
      });
      const fakeIdGenerator = '123'; // stub!
      const userId = `user-${fakeIdGenerator}`;
      const threadId = `thread-${fakeIdGenerator}`;
      const threadCommentId = `comment-${fakeIdGenerator}`;
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadTableTestHelper.addThread({ threadId, userId });
      await ThreadCommentTableTestHelper.addThreadComment({ ...threadCommentPayload, userId, threadId, commentId: threadCommentId });
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});
      const rowUser = await UsersTableTestHelper.findUsersById(userId);
      const commentsResponse = [{
        id: threadCommentId,
        content: threadCommentPayload.content,
        username: rowUser[0].username,
        created_at: '2023-08-29',
        deleted_at: null,
      }];
      const newThreadCommentResponse = new ThreadComment(commentsResponse);
      const threadComment = await threadCommentRepositoryPostgres.getCommentByThreadId(threadId);

      // Assert
      expect(threadComment).toStrictEqual(newThreadCommentResponse);
    });
  });

  describe('getThreadComment function', () => {
    it('should throw NotFoundError when threadCommentId not found', async () => {
      const threadCommentPayload = new NewThreadCommentPayload({
        content: 'hanya',
      });

      const fakeIdGenerator = '123'; // stub!
      const userId = `user-${fakeIdGenerator}`;
      const threadId = `thread-${fakeIdGenerator}`;
      const threadCommentId = 'comment-000';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadTableTestHelper.addThread({ id: userId });
      await ThreadCommentTableTestHelper.addThreadComment({ ...threadCommentPayload, userId, threadId });
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.getThreadComment(threadCommentId)).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when threadCommentId exist', async () => {
      const threadCommentPayload = new NewThreadCommentPayload({
        content: 'hanya',
      });

      const fakeIdGenerator = '123'; // stub!
      const userId = `user-${fakeIdGenerator}`;
      const threadId = `thread-${fakeIdGenerator}`;
      const threadCommentId = `comment-${fakeIdGenerator}`;

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadTableTestHelper.addThread({ id: userId });
      await ThreadCommentTableTestHelper.addThreadComment({ ...threadCommentPayload, userId, threadId, commentId: threadCommentId });
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.getThreadComment(threadCommentId)).resolves.not.toThrowError(NotFoundError);
    });

    it('should return thread detail correctly', async () => {
      // Arrange
      const threadCommentPayload = new NewThreadCommentPayload({
        content: 'hanya',
      });
      const fakeIdGenerator = '123'; // stub!
      const userId = `user-${fakeIdGenerator}`;
      const threadId = `thread-${fakeIdGenerator}`;
      const threadCommentId = `comment-${fakeIdGenerator}`;
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadTableTestHelper.addThread({ threadId, userId });
      await ThreadCommentTableTestHelper.addThreadComment({ ...threadCommentPayload, userId, threadId, commentId: threadCommentId });
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});
      const rowUser = await UsersTableTestHelper.findUsersById(userId);
      const commentsResponse = [{
        id: threadCommentId,
        content: threadCommentPayload.content,
        username: rowUser[0].username,
        created_at: '2023-08-29',
        deleted_at: null,
      }];
      const newThreadCommentResponse = new ThreadComment(commentsResponse);
      const threadComment = await threadCommentRepositoryPostgres.getThreadComment(threadCommentId);

      // Assert
      expect(threadComment).toStrictEqual(newThreadCommentResponse);
    });
  });

  describe('verifyThreadCommentAvailability function', () => {
    it('should throw NotFoundError when threadCommentId not found', async () => {
      // Arrange

      const threadCommentPayload = new NewThreadCommentPayload({
        content: 'hanya',
      });

      const fakeIdGenerator = '123'; // stub!
      const userId = `user-${fakeIdGenerator}`;
      const threadId = `thread-${fakeIdGenerator}`;
      const threadCommentId = `comment-${fakeIdGenerator}`;

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadTableTestHelper.addThread({ id: userId });
      await ThreadCommentTableTestHelper.addThreadComment({ ...threadCommentPayload, userId, threadId, commentId: threadCommentId });
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.verifyThreadCommentAvailability(threadId)).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when threadCommentId exist', async () => {
      // Arrange
      const threadCommentPayload = new NewThreadCommentPayload({
        content: 'hanya',
      });

      const fakeIdGenerator = '123'; // stub!
      const userId = `user-${fakeIdGenerator}`;
      const threadId = `thread-${fakeIdGenerator}`;
      const threadCommentId = `comment-${fakeIdGenerator}`;

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadTableTestHelper.addThread({ threadId, userId });
      await ThreadCommentTableTestHelper.addThreadComment({ ...threadCommentPayload, commentId: threadCommentId, threadId, userId });
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.verifyThreadCommentAvailability(threadCommentId)).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('addThreadComment function', () => {
    it('should persist threadComment and return created threadComment correctly', async () => {
      // Arrange
      const threadCommentPayload = new NewThreadCommentPayload({
        content: 'hanya',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const userId = `user-${fakeIdGenerator()}`;
      const threadId = `thread-${fakeIdGenerator()}`;

      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadTableTestHelper.addThread({ threadId, userId });
      const { id: threadCommentId } = await threadCommentRepositoryPostgres.addThreadComment({ ...threadCommentPayload, threadId, userId });

      // Assert
      const threads = await ThreadCommentTableTestHelper.findThreadCommentById(threadCommentId);
      expect(threads).toHaveLength(1);
    });

    it('should return threadComment correctly', async () => {
      // Arrange
      const threadCommentPayload = new NewThreadCommentPayload({
        content: 'hanya',
      });

      const fakeIdGenerator = () => '123'; // stub!

      const userId = `user-${fakeIdGenerator()}`;
      const threadId = `thread-${fakeIdGenerator()}`;

      const threadResponse = {
        content: threadCommentPayload.content,
        owner: userId,
        id: 'comment-123',
      };

      const newThreadCommentResponse = new NewThreadCommentResponse(threadResponse);
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadTableTestHelper.addThread({ threadId, userId });
      const thread = await threadCommentRepositoryPostgres.addThreadComment({ ...threadCommentPayload, userId, threadId });

      // Assert
      expect(thread).toStrictEqual(newThreadCommentResponse);
    });
  });

  describe('delThreadComment function', () => {
    it('should not return an error', async () => {
      // Arrange
      const fakeIdGenerator = '12322'; // stub!
      const userMamat = {
        id: `user-${fakeIdGenerator}`,
        username: 'mamat-ushop',
      };
      const threadId = `thread-${fakeIdGenerator}`;
      const threadCommentId = `comment-${fakeIdGenerator}`;

      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action
      await UsersTableTestHelper.addUser(userMamat);
      await ThreadTableTestHelper.addThread({ threadId, userId: userMamat.id });
      await ThreadCommentTableTestHelper.addThreadComment({ threadId, userId: userMamat.id, threadCommentId });

      // Assert
      expect(threadCommentRepositoryPostgres.delThreadComment({ commentId: threadCommentId, threadId, userId: userMamat.id })).resolves.not.toThrowError(AuthorizationError);
    });

    it('should return authorization error', async () => {
      // Arrange
      const fakeIdGenerator = '123'; // stub!
      const userMamat = {
        id: `user-${fakeIdGenerator}`,
        username: 'mamat',
      };
      const userMemet = {
        id: 'user-000',
        username: 'memet',
      };
      const threadId = `thread-${fakeIdGenerator}`;
      const threadCommentId = `comment-${fakeIdGenerator}`;

      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action
      await UsersTableTestHelper.addUser(userMemet);
      await UsersTableTestHelper.addUser(userMamat);
      await ThreadTableTestHelper.addThread({ threadId, userId: userMamat.id });
      await ThreadCommentTableTestHelper.addThreadComment({ threadId, userId: userMamat.id, threadCommentId });

      // Assert
      expect(threadCommentRepositoryPostgres.delThreadComment({ commentId: threadCommentId, threadId, userId: userMemet.id })).rejects.toThrowError(AuthorizationError);
    });
  });
});
