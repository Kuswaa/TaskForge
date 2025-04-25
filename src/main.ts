import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBflGldawmh-5zaf1-vcw1hJ7wBa7SKxmE",
  authDomain: "taskforge-v1.firebaseapp.com",
  projectId: "taskforge-v1",
  storageBucket: "taskforge-v1.firebasestorage.app",
  messagingSenderId: "1097858621872",
  appId: "1:1097858621872:web:411b582a7449d4fda3b675"
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
