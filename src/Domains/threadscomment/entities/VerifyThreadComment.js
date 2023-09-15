const InvariantError = require('../../../Commons/exceptions/InvariantError');

class VerifyThreadComment {
  constructor({ id }) {
    this._verifyPayload(id);
    this.id = id;
  }

  _verifyPayload(id) {
    if (!id) {
      throw new InvariantError('VERIFY__THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string') {
      throw new InvariantError('VERIFY_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = VerifyThreadComment;
