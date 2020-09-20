enum ErrorCode {
  NoError = 'NO',
  GenericError = 'ERR',
  DBError = 'DB',
  UnAuthorized = 'AUTH',
  ServiceProviderFault = 'SP',
  RequestError = 'REQ',
  Exception = 'EX',
}

export default ErrorCode;
