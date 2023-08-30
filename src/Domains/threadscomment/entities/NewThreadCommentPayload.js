const InvariantError = require('../../../Commons/exceptions/InvariantError');

class NewThreadCommentPayload {
  constructor(payload) {
    this._verifyPayload(payload);

    this.content = payload.content;
  }

  _verifyPayload(payload) {
    const { content } = payload;
    if (!content) {
      throw new InvariantError('NEW_THREAD_COMMENT_PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new InvariantError('NEW_THREAD_COMMENT_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewThreadCommentPayload;
