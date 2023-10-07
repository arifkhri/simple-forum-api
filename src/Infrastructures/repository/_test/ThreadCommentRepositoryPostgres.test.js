const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NewThreadCommentPayload = require('../../../Domains/threadscomment/entities/NewThreadCommentPayload');
const NewThreadCommentResponse = require('../../../Domains/threadscomment/entities/NewThreadCommentResponse');
const ThreadComment = require('../../../Domains/threadscomment/entities/ThreadComment');
const VerifyThreadComment = require('../../../Domains/threadscomment/entities/VerifyThreadComment');
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

  describe('verifyThreadCommentAvailability function', () => {
    it('should return threadCommentId not found', async () => {
      // Arrange

      const threadCommentPayload = new NewThreadCommentPayload({
        content: 'hanya',
      });

      const fakeIdGenerator = '123'; // stub!
      const userId = `user-${fakeIdGenerator}`;
      const threadId = `thread-${fakeIdGenerator}`;
      const threadCommentIdNotFound = 'thread-000';
      const threadCommentId = `comment-${fakeIdGenerator}`;

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadTableTestHelper.addThread({ id: userId });
      await ThreadCommentTableTestHelper.addThreadComment({ ...threadCommentPayload, userId, threadId, commentId: threadCommentId });
      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadCommentRepositoryPostgres.verifyThreadCommentAvailability(threadCommentIdNotFound)).rejects.toThrowError(NotFoundError);
    });

    it('should return threadCommentId exist', async () => {
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
      const verifyData = await threadCommentRepositoryPostgres.verifyThreadCommentAvailability(threadCommentId);
      expect(verifyData).toStrictEqual(new VerifyThreadComment({ id: threadCommentId }));
    });
  });

  describe('addThreadComment function', () => {
    it('should persist threadComment and return created threadComment correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const userId = `user-${fakeIdGenerator()}`;
      const threadId = `thread-${fakeIdGenerator()}`;
      const threadCommentId = `comment-${fakeIdGenerator()}`;

      const threadCommentPayload = new NewThreadCommentPayload({
        content: 'hanya',
      });

      const expectedThreadComment = new NewThreadCommentResponse({
        content: 'hanya',
        owner: userId,
        id: threadCommentId,
      });

      const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadTableTestHelper.addThread({ threadId, userId });
      const createdComment = await threadCommentRepositoryPostgres.addThreadComment({ ...threadCommentPayload, threadId, userId });
      const threadComments = await ThreadCommentTableTestHelper.findThreadCommentById(threadCommentId);
      const persistComment = {
        content: threadComments[0].content,
        id: threadComments[0].id,
        owner: threadComments[0].owner,
      };

      // Assert
      expect(persistComment).toEqual(expectedThreadComment);
      expect(createdComment).toEqual(expectedThreadComment);
    });
  });

  describe('deleteThreadComment function', () => {
    it('should return valid column deleted_at', async () => {
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
      await threadCommentRepositoryPostgres.deleteThreadComment({ commentId: threadCommentId, threadId, userId: userMamat.id });
      const threadComments = await ThreadCommentTableTestHelper.findThreadCommentById(threadCommentId);
      const deleted_at = threadComments[0].deleted_at;
      // Assert
      expect(deleted_at).not.toBeNull();
    });
  });

  describe('verifyThreadCommentAccess function', () => {
    it('should not return n error', async () => {
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
      expect(threadCommentRepositoryPostgres.verifyThreadCommentAccess({ commentId: threadCommentId, threadId, userId: userMamat.id })).resolves.not.toThrowError(AuthorizationError);
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
      expect(threadCommentRepositoryPostgres.verifyThreadCommentAccess({ commentId: threadCommentId, threadId, userId: userMemet.id })).rejects.toThrowError(AuthorizationError);
    });
  });
});
