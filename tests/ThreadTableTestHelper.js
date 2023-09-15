/* istanbul ignore file */
const NewThreadResponse = require('../src/Domains/threads/entities/NewThreadResponse');
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadTableTestHelper = {
  async addThread({
    threadId = 'thread-123', title = 'title', body = 'no-body', userId = 'user-123',
  }) {
    const createdAt = '2023-08-29';

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6) RETURNING id, title, body, owner, created_at, updated_at',
      values: [threadId, title, body, userId, createdAt, createdAt],
    };

    await pool.query(query);
  },

  async findThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return new NewThreadResponse({ ...result.rows[0] });
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadTableTestHelper;
