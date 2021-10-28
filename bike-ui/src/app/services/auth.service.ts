import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import 'rxjs/add/operator/filter';
import * as auth0 from 'auth0-js';

@Injectable()
export class AuthService {

  auth0 = new auth0.WebAuth({
    clientID: 'NSouaKT4cY8UrJG5DdlX0wNhwZVedvCB',
    domain: 'dev-uxhovhxn.us.auth0.com',
    responseType: 'token id_token',
    audience: 'http://localhost:8080',
    redirectUri: 'http://localhost:4200/callback',
    scope: 'openid view:registration view:registrations'
  });

  constructor(public router: Router) {}

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        this.router.navigate(['/admin']);
      } else if (err) {
        this.router.navigate(['/admin']);
        console.log(err);
      }
    });
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const bikeExpiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('bike_access_token', authResult.accessToken);
    localStorage.setItem('bike_id_token', authResult.idToken);
    localStorage.setItem('bike_expires_at', bikeExpiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('bike_access_token');
    localStorage.removeItem('bike_id_token');
    localStorage.removeItem('bike_expires_at');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const bikeExpiresAt = JSON.parse(localStorage.getItem('bike_expires_at') || "");
    return new Date().getTime() < bikeExpiresAt;
  }

}