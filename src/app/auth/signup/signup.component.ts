import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-signup',
  imports: [RouterLink , FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent
{

  constructor(private authService: AuthService) {}

  username: string = '';
  password: string = '';

  signup() {
    const email = `${this.username}@dummy.com`;
    this.authService.signup(email, this.password)
      .then(() => {
        console.log('Signup successful');
      })
      .catch((error) => {
        console.error('Signup failed', error);
      });
  }
}
