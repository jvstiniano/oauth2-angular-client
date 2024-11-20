export const environment = {
    production: true,
    auth: {
        clientId: 'develop',
        authEndpoint: 'http://production.domain:9000/oauth/oauth2/authorize?',
        tokenEndpoint: 'http://production.domain:9000/oauth/oauth2/token',
        redirectUri: 'http://production.web.domain/authorized',
        scope: 'openid',
        responseMode: 'form_post',
        grantType: 'authorization_code',
        resource_url: 'http://production.resource.domain:8080/',
        logout_url: 'http://production.domain:9000/oauth/logout',
        pattern_url_api: 'api-app',
        basic_auth: 'Basic ZGV2ZWxvcDpEZDXXZnbHIkMjAyNAAA',
    }
  };