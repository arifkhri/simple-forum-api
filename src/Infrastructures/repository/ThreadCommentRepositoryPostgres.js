const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NewThreadComment = require('../../Domains/threadscomment/entities/NewThreadComment');
const ThreadComment = require('../../Domains/threadscomment/entities/ThreadComment');
const ThreadCommentRepository = require('../../Domains/threadscomment/ThreadCommentRepository');

class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThreadComment(newThread) {
    const { content, threadId, userId } = newThread;
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, thread_id, content, owner',
      values: [id, threadId, content, userId, createdAt, createdAt],
    };

    const result = await this._pool.query(query);

    return new NewThreadComment({ ...result.rows[0] });
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: `SELECT thread_comments.id, thread_comments.content, thread_comments.created_at as date, users.username FROM thread_comments
        INNER JOIN users ON users.id = thread_comments.owner
        WHERE thread_comments.thread_id = $1
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return new ThreadComment(result.rows);
  }

  async delThreadComment({ commentId, userId, threadId }) {
    const query = {
      text: 'DELETE FROM thread_comments WHERE id = $1 AND owner=$2 AND thread_id=$3 RETURNING id',
      values: [commentId, userId, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Error akses dibatasi');
    }
  }

  async getThreadComment(commentId) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1 ',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komen tidak ditemukan');
    }

    return new ThreadComment(result.rows);
  }
}

module.exports = ThreadCommentRepositoryPostgres;
