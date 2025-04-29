import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { DatabaseCommService } from '../database-comm.service'; 

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {

  constructor(private authService: AuthService, private dbService: DatabaseCommService) {}

  logout() {
    this.authService.logout();
  }

  createTask(): void {
    const newTask = {
      title: 'New Task',
      description: 'Description of the task',
      category: 'Work',
      date: new Date().toISOString().split('T')[0],
      completed: false
    };

    this.dbService.addTask(newTask).subscribe({
      next: () => {
        console.log('Task created successfully');
      },
      error: (error) => {
        console.error('Error creating task:', error);
      }
    });
  }
}
