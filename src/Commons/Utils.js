const getHeaderToken = (headers) => {
  const { authorization = '' } = headers;
  const token = authorization.replace('Bearer ', '');
  return token;
};

export default { getHeaderToken };
