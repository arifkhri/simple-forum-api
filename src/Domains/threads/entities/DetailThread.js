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

  _verifyPayload({ id = '', title = '', body = '', date= '', username = '' }) {
    if (!id || !title || !body || !date || !username) {
      throw new InvariantError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}

module.exports = DetailThread;
