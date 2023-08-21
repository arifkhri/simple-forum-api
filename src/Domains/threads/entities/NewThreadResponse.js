const InvariantError = require('../../../Commons/exceptions/InvariantError');

class NewThreadResponse {
  constructor(payload) {
    this._verifyPayload(payload);

    this.title = payload.title;
    this.owner = payload.owner;
    this.id = payload.id;
  }

  _verifyPayload({ title = '', owner = '', id = '' }) {
    if (!title || !owner || !id) {
      throw new InvariantError('NEW_THREAD_RESPONSE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof owner !== 'string' || typeof id !== 'string') {
      throw new InvariantError('NEW_THREAD_RESPONSE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewThreadResponse;
