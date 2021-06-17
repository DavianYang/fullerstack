import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { LoggerService } from '@fullerstack/ngx-logger';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthAuthenticatedGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private logger: LoggerService, private auth: AuthService) {
    this.logger.info('AuthAuthenticatedGuard loaded ...');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.handleRequest(state.url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.handleRequest(state.url);
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.auth.state.isLoggedIn) {
      return true;
    }
    this.auth.goTo(this.auth.loginUrl);
  }

  private handleRequest(url?: string): boolean {
    if (this.auth.state.isLoggedIn) return true;
    this.auth.nextUrl = url;
    this.auth.goTo(this.auth.loginUrl);
    return false;
  }
}
