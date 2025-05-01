import { HeaderComponent } from '../header/header.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { HomeComponent } from '../home/home.component';
import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { DatabaseCommService } from '../database-comm.service'; 
import { Task } from '../models/task.model'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, SidenavComponent, HomeComponent, CommonModule, FormsModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  showCreateModal = false;

  newTask: Task = {
    title: '',
    description: '',
    category: '',
    date: '',
    completed: false
  };

  constructor(private authService: AuthService, private dbService: DatabaseCommService) {}


  submitCreate(): void {
    if (!this.newTask.title || !this.newTask.description || !this.newTask.category || !this.newTask.date) {
      console.warn('Please fill in all fields');
      return;
    }
  
    this.dbService.addTask(this.newTask).subscribe({
      next: () => {
        console.log('Task created successfully');
        this.showCreateModal = false;
        this.resetNewTask();
      },
      error: (error: unknown) => {
        console.error('Error creating task:', error);
      }
    });
  }
  

  openCreateModal()
  {
    this.showCreateModal = true;
  }

  closeModal(): void {
    this.showCreateModal = false;
    this.resetNewTask(); 
  }

  resetNewTask(): void {
    this.newTask = {
      title: '',
      description: '',
      category: '',
      date: '',
      completed: false
    };
  }
}

