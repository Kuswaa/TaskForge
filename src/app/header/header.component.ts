import { Component } from '@angular/core';  
import { ThemeToggleService } from '../theme-toggle.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent
{
  isDarkMode: boolean = false;

  toggleDarkMode()
  {
    this.isDarkMode = !this.isDarkMode;
  }

  constructor(public themeToggleService: ThemeToggleService) {}
}
