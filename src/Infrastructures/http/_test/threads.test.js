const Jwt = require('@hapi/jwt');

const pool = require('../../database/postgres/pool');
const JwtTokenManager = require('../../security/JwtTokenManager');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

const jwtTokenManager = new JwtTokenManager(Jwt.token);

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted threads', async () => {
      // Arrange
      const requestPayload = {
        body: 'hanya body',
        title: 'title',
      };
      const userId = 'user-123';
      const server = await createServer(container, jwtTokenManager);
      await UsersTableTestHelper.addUser({ id: userId });
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding', id: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        body: 'hanya body',
      };
      const userId = 'user-123';
      const server = await createServer(container, jwtTokenManager);
      await UsersTableTestHelper.addUser({ id: userId });
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding', id: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('NEW_THREAD_PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        body: 'hanya body',
        title: true,
      };
      const userId = 'user-123';
      const server = await createServer(container, jwtTokenManager);
      await UsersTableTestHelper.addUser({ id: userId });
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding', id: userId });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('NEW_THREAD_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should response 401', async () => {
      // Arrange
      const requestPayload = {
        body: 'hanya body',
        title: 'title',
      };
      const server = await createServer(container, jwtTokenManager);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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

  describe('when GET /threads/{id}', () => {
    it('should response 200 and persisted threads', async () => {
      // Arrange
      const server = await createServer(container);
      const userId = 'user-123';
      const threadId = 'thread-123';
      await UsersTableTestHelper.addUser({ id: userId });

      await ThreadTableTestHelper.addThread({ userId, threadId });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
    });

    it('should response 404, not found threads', async () => {
      // Arrange
      const server = await createServer(container);
      const userId = 'user-123';
      const threadId = 'thread-123';
      const threadNotFoundId = 'thread-000';
      await UsersTableTestHelper.addUser({ id: userId });

      await ThreadTableTestHelper.addThread({ userId, threadId });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadNotFoundId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });
});
