/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');
const NewThreadResponse = require('../src/Domains/threadscomment/entities/NewThreadCommentResponse');

const ThreadCommentTableTestHelper = {
  async addThreadComment({
    threadCommentId = 'comment-123', threadId = 'thread-123', content = 'title', userId = 'user-123',
  }) {
    const createdAt = '2023-08-29';

    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, thread_id, content, owner',
      values: [threadCommentId, threadId, content, userId, createdAt, createdAt],
    };

    await pool.query(query);
  },

  async findThreadCommentById(id) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return new NewThreadResponse({ ...result.rows[0] });
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread_comments WHERE 1=1');
  },
};

module.exports = ThreadCommentTableTestHelper;
