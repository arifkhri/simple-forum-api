const InvariantError = require('../../../Commons/exceptions/InvariantError');

class VerifyThread {
  constructor({ id }) {
    this._verifyPayload(id);
    this.id = id;
  }

  _verifyPayload(id) {
    if (!id) {
      throw new InvariantError('VERIFY_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string') {
      throw new InvariantError('VERIFY_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = VerifyThread;
