import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from '@angular/fire/auth';
import { setPersistence, browserLocalPersistence } from 'firebase/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  private isAuthInitialized = new BehaviorSubject<boolean>(false);
  isAuthInitialized$ = this.isAuthInitialized.asObservable();

  constructor(private auth: Auth, private router: Router) {
    this.initAuthListener();
  }

  private initAuthListener(): void {
    setPersistence(this.auth, browserLocalPersistence)
      .then(() => {
        onAuthStateChanged(this.auth, (user) => {
          console.log('User state changed: ', user);
          this.userSubject.next(user);
          this.isAuthInitialized.next(true); 
        });
      })
      .catch((error) => {
        console.error('Error setting persistence:', error);
      });
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async signup(email: string, password: string): Promise<void> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  getCurrentUserId(): string | null {
    return this.userSubject.value?.uid ?? null;
  }

  getCurrentUserIdAsync(): Promise<string | null> {
    return new Promise((resolve) => {
      const sub = this.user$.subscribe((user) => {
        if (user) {
          resolve(user.uid);
          sub.unsubscribe();
        }
      });
    });
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  getUserObservable(): Observable<User | null> {
    return this.user$;
  }
}
