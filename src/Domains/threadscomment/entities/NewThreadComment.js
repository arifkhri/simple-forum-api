const InvariantError = require('../../../Commons/exceptions/InvariantError');

class NewThreadComment {
  constructor(payload) {
    this._verifyPayload(payload);

    this.content = payload?.content || '';
    this.owner = payload?.owner || '';
    this.id = payload?.id || '';
  }

  _verifyPayload(payload) {
    if (!payload?.content) {
      throw new InvariantError('NEW_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof payload?.content !== 'string') {
      throw new InvariantError('NEW_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewThreadComment;
