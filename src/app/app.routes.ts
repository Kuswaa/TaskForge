import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes =
[
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },        
    { path: 'signup', component: SignupComponent },      
    { path: 'home', component: LayoutComponent, canActivate: [authGuard] }, 
    { path: '**', redirectTo: 'login' }             
];
