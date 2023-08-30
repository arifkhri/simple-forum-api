const NewThreadPayload = require('../../Domains/threads/entities/NewThreadPayload');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, userId) {
    const newThread = new NewThreadPayload(useCasePayload);

    return this._threadRepository.addThread({ ...newThread, userId });
  }
}

module.exports = AddThreadUseCase;
