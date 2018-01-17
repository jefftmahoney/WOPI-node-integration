module.exports = {
    creds: {
      redirectUrl: 'http://localhost:3001/token',
      clientID: 'fe9da1e6-5b61-4831-9751-dd0d5959be40',
      clientSecret: 'fKgWHHHYvKpjb6fI5xSjhwWONRYzu3RC0Gz9tHB8VWY=',
      identityMetadata: 'https://login.microsoftonline.com/triconinfotech.com/v2.0/.well-known/openid-configuration',
      allowHttpForRedirectUrl: true, // For development only
      responseType: 'code',
      validateIssuer: false, // For development only
      responseMode: 'query',
      scope: ['User.Read', 'Mail.Send', 'Files.ReadWrite']
    }
  };