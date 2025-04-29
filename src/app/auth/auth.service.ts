import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth, private router: Router) {}

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        localStorage.setItem('isLoggedIn', 'true');
        this.router.navigate(['/home']);
      });
  }

  signup(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        localStorage.setItem('isLoggedIn', 'true');
        this.router.navigate(['/home']);
      });
  }

  logout() {
    return signOut(this.auth).then(() => {
      localStorage.removeItem('isLoggedIn');
      this.router.navigate(['/login']);
    });
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

}
