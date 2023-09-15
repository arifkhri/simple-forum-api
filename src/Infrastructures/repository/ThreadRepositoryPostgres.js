const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const DetailThread = require('../../Domains/threads/entities/DetailThread');
const VerifyThread = require('../../Domains/threads/entities/VerifyThread');
const NewThreadResponse = require('../../Domains/threads/entities/NewThreadResponse');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, userId } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6) RETURNING id, title, body, owner, created_at, updated_at',
      values: [id, title, body, userId, createdAt, createdAt],
    };

    const result = await this._pool.query(query);

    return new NewThreadResponse({ ...result.rows[0] });
  }

  async getThread(threadId) {
    const query = {
      text: 'SELECT threads.id, threads.created_at as date, threads.title, threads.body, users.username FROM threads INNER JOIN users ON users.id = threads.owner WHERE threads.id = $1 ',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return new DetailThread({ ...result.rows[0] });
  }

  async verifyThreadAvailability(threadId) {
    const query = {
      text: 'SELECT threads.id FROM threads WHERE threads.id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return new VerifyThread({ ...result.rows[0] });
  }
}

module.exports = ThreadRepositoryPostgres;
