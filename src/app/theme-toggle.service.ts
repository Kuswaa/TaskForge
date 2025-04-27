import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeToggleService
{
  constructor() { }
  
  toggleDarkMode()
  {
    document.documentElement.classList.toggle('dark');
  }
}
