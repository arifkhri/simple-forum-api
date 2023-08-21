const InvariantError = require('../../../Commons/exceptions/InvariantError');

class NewThreadPayload {
  constructor(payload) {
    this._verifyPayload(payload);

    this.title = payload.title;
    this.body = payload.body;
  }

  _verifyPayload({ title = '', body = '' }) {
    if (!title || !body) {
      throw new InvariantError('NEW_THREAD_PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new InvariantError('NEW_THREAD_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewThreadPayload;
