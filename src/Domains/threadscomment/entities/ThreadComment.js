const InvariantError = require('../../../Commons/exceptions/InvariantError');

class ThreadComment {
  constructor(rows) {
    this._verifyPayload(rows);
    this.comments = this.mapDBToModelList(rows);
  }

  mapDBToModelList(rows) {
    const newData = [];
    rows.forEach(({
      id, content, created_at, username, deleted_at,
    }) => {
      const rowData = {
        id, content, date: created_at, username,
      };

      if (deleted_at) {
        rowData.content = '**komentar telah dihapus**';
      }

      newData.push(rowData);
    });
    return newData;
  }

  _verifyPayload(rows) {
    if (!Array.isArray(rows)) {
      throw new InvariantError('THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    } else {
      rows.forEach(({
        id, content, created_at, username, deleted_at,
      }) => {
        if (typeof id !== 'string') {
          throw new InvariantError('THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
        if (typeof content !== 'string') {
          throw new InvariantError('THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
        if (typeof created_at !== 'string') {
          throw new InvariantError('THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
        if (typeof username !== 'string') {
          throw new InvariantError('THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
        if (deleted_at !== null && typeof deleted_at !== 'string') {
          throw new InvariantError('THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }
      });
    }
  }
}

module.exports = ThreadComment;
