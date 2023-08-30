const InvariantError = require('../../../Commons/exceptions/InvariantError');

class NewThreadCommentResponse {
  constructor(response) {
    this._verifyPayload(response);

    this.content = response.content;
    this.id = response.id;
    this.owner = response.owner;
  }

  _verifyPayload(response) {
    const { content, id, owner } = response;
    if (!content || !id || !owner) {
      throw new InvariantError('NEW_THREAD_COMMENT_RESPONSE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof id !== 'string' || typeof owner !== 'string') {
      throw new InvariantError('NEW_THREAD_COMMENT_RESPONSE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewThreadCommentResponse;
