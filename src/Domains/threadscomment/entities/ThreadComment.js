const InvariantError = require('../../../Commons/exceptions/InvariantError');

class ThreadComment {
  constructor(rows) {
    this._verifyPayload(rows);
    this.comments = this.mapDBToModelList(rows);
  }

  mapDBToModelList(rows) {
    const newData = [];
    rows.forEach(({
      id, content, date, username,
    }) => {
      newData.push({
        id, content, date, username,
      });
    });
    return newData;
  }

  _verifyPayload(rows) {
    if (!Array.isArray(rows)) {
      throw new InvariantError('THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ThreadComment;
