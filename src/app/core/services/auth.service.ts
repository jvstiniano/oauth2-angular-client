import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable, tap } from 'rxjs';
import { PKCEUtil } from '../../utils/pkce.util';
import { UserLogin } from '../../shared/models/user-login';
import { Role } from '../../shared/models/role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'auth_token';
  private readonly CODE_VERIFIER_KEY = 'code_verifier';
  private readonly LOGIN_USER = 'user';
  private _userLogin: UserLogin | null = null;
  private _token: string | null = '';

  private http = inject(HttpClient);
  constructor() {
    this.checkToken();
  }

  async login(): Promise<void> {
    const { codeVerifier, codeChallenge } = await PKCEUtil.generateCodeChallenge();
    sessionStorage.setItem(this.CODE_VERIFIER_KEY, codeVerifier);

    const authUrl = new URL(environment.auth.authEndpoint);
    authUrl.searchParams.append('client_id', environment.auth.clientId);
    authUrl.searchParams.append('redirect_uri', environment.auth.redirectUri);
    authUrl.searchParams.append('scope', environment.auth.scope);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('response_mode', environment.auth.responseMode);
    authUrl.searchParams.append('code_challenge', codeChallenge);
    authUrl.searchParams.append('code_challenge_method', 'S256');
    
    location.href = authUrl.toString();
  }

  handleCallback(code: string): Observable<any> {
    const codeVerifier = sessionStorage.getItem(this.CODE_VERIFIER_KEY);
    if (!codeVerifier) {
      throw new Error('No code verifier found');
    }
    return this.getToken(code, codeVerifier);
  }

  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.LOGIN_USER);
    location.href = environment.auth.logout_url
  }

  isAuthenticated(): boolean {
    const token = this.getSavedToken();
    return !!token && !this.isTokenExpired(token);
  }

  private checkToken(): void {
    const token = this.getSavedToken();
    if (token && !this.isTokenExpired(token)) {
      console.log('Token is valid');
    }
  }

  getSavedToken(): any {
    const token = sessionStorage.getItem(this.TOKEN_KEY);
    return token ? JSON.parse(token) : null;
  }


  getToken(code: string, codeVerifier: string): Observable<any> {
    let body = new URLSearchParams();
    body.set('grant_type', environment.auth.grantType);
    body.set('client_id', environment.auth.clientId);
    body.set('redirect_uri', environment.auth.redirectUri);
    body.set('scope', environment.auth.scope);
    body.set('code_verifier', codeVerifier);
    body.set('code', code);
    const basic_auth = environment.auth.basic_auth;
    const headers_object = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*',
      'Authorization': basic_auth
    });
    const httpOptions = { headers: headers_object};
    return this.http.post<any>(environment.auth.tokenEndpoint, body, httpOptions).pipe(
      tap(token => {
        sessionStorage.removeItem(this.CODE_VERIFIER_KEY);
        console.log('token: ', token);
        this.setToken(token);
        this.saveUserLogin(token.access_token);
      })
    );

  }

  private setToken(token: any): void {
    sessionStorage.setItem(this.TOKEN_KEY, JSON.stringify(token));
  }

  private isTokenExpired(token: any): boolean {
    const expirationDate = new Date(token.exp * 1000);
    return expirationDate <= new Date();
  }

  public get userLogin(): UserLogin {
    if (this._userLogin) {
      return this._userLogin;
    } else {
      this._userLogin = JSON.parse(sessionStorage.getItem(this.LOGIN_USER)!) as UserLogin;
      return this._userLogin;
    }
  }

  saveUserLogin(accessToken: string): void {
    let payload = this.getPayloadFronToken(accessToken);
    let authorities:string[] = payload.roles;
    this._userLogin = new UserLogin();
    this._userLogin.id = payload.id;
    this._userLogin.username = payload.username;
    this._userLogin.personArea = payload.div;
    this._userLogin.roles = authorities.map(rol => {
      let role = new Role();
      role.name=rol;
      return role;
    });
    console.log('user: ', this._userLogin);
    sessionStorage.setItem(this.LOGIN_USER, JSON.stringify(this._userLogin));
  }

  getPayloadFronToken(accessToken: string): any {
    if (accessToken) {
      return JSON.parse(atob(accessToken.split(".")[1]));
    } 
    return null;
  }

  hasRole(role: string): boolean {
    const roleNames = this.userLogin.roles.map(rol=>rol.name);
    if (roleNames.includes(role)) {
      return true;
    } else{
      return false;
    }
  }
}
