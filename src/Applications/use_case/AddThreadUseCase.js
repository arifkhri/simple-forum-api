const NewThread = require('../../Domains/threads/entities/NewThreadPayload');

class AddThreadUseCase {
  constructor({ threadRepository, authenticationTokenManager }) {
    this._threadRepository = threadRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload, useCaseReqHeaders) {
    // verify token;
    const { authorization = '' } = useCaseReqHeaders;
    const token = authorization.replace('Bearer ', '');
    await this._authenticationTokenManager.verifyAccessToken(token);

    const tokenData = await this._authenticationTokenManager.decodePayload(token);
    const newThread = new NewThread(useCasePayload);

    return this._threadRepository.addThread({ ...newThread, userId: tokenData?.id || '' });
  }
}

module.exports = AddThreadUseCase;
