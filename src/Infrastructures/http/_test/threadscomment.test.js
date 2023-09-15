const Jwt = require('@hapi/jwt');

const pool = require('../../database/postgres/pool');
const JwtTokenManager = require('../../security/JwtTokenManager');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsCommentHandler = require('../../../../tests/ThreadCommentTableTestHelper');

const jwtTokenManager = new JwtTokenManager(Jwt.token);

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await ThreadsCommentHandler.cleanTable();
  });

  describe('when POST /threads/{id}/comments', () => {
    it('should response 201 and persisted threadscomment', async () => {
      // Arrange
      const requestPayload = {
        content: 'content',
      };
      const userId = 'user-123';
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadTableTestHelper.addThread({ userId, threadId });
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding', id: userId });
      const server = await createServer(container, jwtTokenManager);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 404, thread Id not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'content',
      };
      const userId = 'user-123';
      const threadId = 'thread-123';
      const threadNotFoundId = 'thread-00';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadTableTestHelper.addThread({ userId, threadId });
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding', id: userId });
      const server = await createServer(container, jwtTokenManager);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadNotFoundId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};
      const userId = 'user-123';
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadTableTestHelper.addThread({ userId, threadId });
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding', id: userId });
      const server = await createServer(container, jwtTokenManager);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('NEW_THREAD_COMMENT_PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: true,
      };
      const userId = 'user-123';
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadTableTestHelper.addThread({ userId, threadId });
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding', id: userId });
      const server = await createServer(container, jwtTokenManager);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('NEW_THREAD_COMMENT_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should response 401', async () => {
      // Arrange
      const requestPayload = {};
      const userId = 'user-123';
      const threadId = 'thread-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadTableTestHelper.addThread({ userId, threadId });
      const server = await createServer(container, jwtTokenManager);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 success deleted thread comment', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadTableTestHelper.addThread({ userId, threadId });
      await ThreadsCommentHandler.addThreadComment({
        userId,
        threadId,
        content: 'hanya content',
        commentId,
      });
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding', id: userId });
      const server = await createServer(container, jwtTokenManager);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 404, not found thread comment', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const commentNotFoundId = 'comment-000';
      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadTableTestHelper.addThread({ userId, threadId });
      await ThreadsCommentHandler.addThreadComment({
        userId,
        threadId,
        content: 'hanya content',
        commentId,
      });
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding', id: userId });
      const server = await createServer(container, jwtTokenManager);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentNotFoundId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 403, forbidden access', async () => {
      // Arrange
      const userId = 'user-123';
      const secondUserId = 'user-000';
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      await UsersTableTestHelper.addUser({ id: userId });
      await UsersTableTestHelper.addUser({ id: secondUserId, username: 'username2' });
      await ThreadTableTestHelper.addThread({ userId, threadId });
      await ThreadsCommentHandler.addThreadComment({
        userId,
        threadId,
        content: 'hanya content',
        commentId,
      });
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding', id: secondUserId });
      const server = await createServer(container, jwtTokenManager);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Error akses dibatasi');
    });

    it('should response 401', async () => {
      // Arrange
      const userId = 'user-123';
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadTableTestHelper.addThread({ userId, threadId });
      await ThreadsCommentHandler.addThreadComment({
        userId,
        threadId,
        content: 'hanya content',
        commentId,
      });
      const server = await createServer(container, jwtTokenManager);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });
});
