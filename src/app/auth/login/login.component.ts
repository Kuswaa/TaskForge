import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink , FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent
{
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  login() {
    const email = `${this.username}@dummy.com`;
    this.authService.login(email, this.password)
      .then(() => {
        console.log('Login successful');
      })
      .catch((error) => {
        console.error('Login failed', error);
      });
  }

}
