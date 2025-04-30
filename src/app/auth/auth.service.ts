import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut , getAuth} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root'  
})

export class AuthService {
  constructor(private auth: Auth, private router: Router) {}

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      localStorage.setItem('isLoggedIn', 'true');
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async signup(email: string, password: string): Promise<void> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      localStorage.setItem('isLoggedIn', 'true');
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      localStorage.removeItem('isLoggedIn');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  getCurrentUserId(): string | null {
    const auth = getAuth();
    return auth.currentUser ? auth.currentUser.uid : null;
  }
}
