// const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewThreadPayload = require('../../../Domains/threads/entities/NewThreadPayload');
const NewThreadResponse = require('../../../Domains/threads/entities/NewThreadResponse');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const VerifyThread = require('../../../Domains/threads/entities/VerifyThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('getThread function', () => {
    it('should throw NotFoundError when threadId not found', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-000';
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadTableTestHelper.addThread({ userId });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThread(threadId)).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when threadId exist', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-000';
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadTableTestHelper.addThread({ threadId, userId });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThread(threadId)).resolves.not.toThrowError(NotFoundError);
    });

    it('should return thread detail correctly', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-000';
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadTableTestHelper.addThread({ threadId, userId });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const rowUser = await UsersTableTestHelper.findUsersById(userId);
      const threadResponse = {
        id: threadId,
        title: 'title',
        body: 'no-body',
        username: rowUser[0].username,
        date: '2023-08-29',
      };
      const newThreadResponse = new DetailThread(threadResponse);
      const thread = await threadRepositoryPostgres.getThread(threadId);

      // Assert
      expect(thread).toStrictEqual(newThreadResponse);
    });
  });

  describe('verifyThreadAvailability function', () => {
    it('should return threadId exist', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-000';
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadTableTestHelper.addThread({ threadId, userId });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      const verifyData = await threadRepositoryPostgres.verifyThreadAvailability(threadId);
      expect(verifyData).toStrictEqual(new VerifyThread({ id: threadId }));
    });

    it('should throw error threadId not found', async () => {
      // Arrange
      const userId = 'user-123';
      const threadIdNotFound = 'thread-999';
      const threadId = 'thread-000';
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadTableTestHelper.addThread({ threadId, userId });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadAvailability(threadIdNotFound)).rejects.toThrowError(NotFoundError);
    });
  });

  describe('addThread function', () => {
    it('should persist thread and return created thread correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const userId = `user-${fakeIdGenerator()}`;

      const threadPayload = new NewThreadPayload({
        body: 'hanya body',
        title: 'hanya title',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await UsersTableTestHelper.addUser({ id: userId });
      const createdThread = await threadRepositoryPostgres.addThread({ ...threadPayload, userId });

      // Assert
      const threads = await ThreadTableTestHelper.findThreadById('thread-123');
      expect(createdThread).toStrictEqual(threads);
    });
  });
});
