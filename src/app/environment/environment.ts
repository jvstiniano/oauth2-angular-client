export const environment = {
    production: false,
    auth: {
        clientId: 'develop',
        authEndpoint: 'http://localhost:9000/oauth/oauth2/authorize?',
        tokenEndpoint: 'http://localhost:9000/oauth/oauth2/token',
        redirectUri: 'http://localhost:4200/authorized',
        scope: 'openid',
        responseMode: 'form_post',
        grantType: 'authorization_code',
        resource_url: 'http://localhost:8080/',
        logout_url: 'http://localhost:9000/oauth/logout',
        pattern_url_api: 'api',
        basic_auth: 'Basic ZGV2ZWxvcDpEZDXXZnbHIkMjAyNAAA',
    }
  };