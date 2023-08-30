const InvariantError = require('../../../Commons/exceptions/InvariantError');

class DetailThread {
  constructor(response) {
    this._verifyPayload(response);
    this.id = response.id;
    this.title = response.title;
    this.body = response.body;
    this.date = response.date;
    this.username = response.username;
  }

  _verifyPayload(response) {
    if (!response?.id || !response?.title || !response?.body || !response?.date || !response?.username) {
      throw new InvariantError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof response?.id !== 'string' || typeof response?.title !== 'string' || typeof response?.body !== 'string' || typeof response?.date !== 'string' || typeof response?.username !== 'string') {
      throw new InvariantError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailThread;
