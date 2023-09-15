const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NewThreadCommentResponse = require('../../Domains/threadscomment/entities/NewThreadCommentResponse');
const ThreadComment = require('../../Domains/threadscomment/entities/ThreadComment');
const VerifyThreadComment = require('../../Domains/threadscomment/entities/VerifyThreadComment');
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

    return new NewThreadCommentResponse({ ...result.rows[0] });
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: `SELECT thread_comments.deleted_at, thread_comments.id, thread_comments.content, thread_comments.created_at, users.username FROM thread_comments
        INNER JOIN users ON users.id = thread_comments.owner
        WHERE thread_comments.thread_id = $1
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return new ThreadComment(result.rows);
  }

  async deleteThreadComment({
    commentId,
    userId,
    threadId,
  }) {
    const deletedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE thread_comments SET deleted_at=$1 WHERE id = $2 AND owner=$3 AND thread_id=$4 RETURNING id',
      values: [deletedAt, commentId, userId, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Error akses dibatasi');
    }
  }

  async getThreadComment(commentId) {
    const query = {
      text: 'SELECT thread_comments.deleted_at, thread_comments.id, thread_comments.content, thread_comments.created_at, users.username FROM thread_comments INNER JOIN users ON users.id = thread_comments.owner WHERE thread_comments.id = $1 AND thread_comments.deleted_at IS NULL',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komen tidak ditemukan');
    }

    return new ThreadComment(result.rows);
  }

  async verifyThreadCommentAvailability(commentId) {
    const query = {
      text: 'SELECT id FROM thread_comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return new VerifyThreadComment({ ...result.rows[0] });
  }
}

module.exports = ThreadCommentRepositoryPostgres;
