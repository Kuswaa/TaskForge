import { Component , EventEmitter, Output} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { DatabaseCommService } from '../database-comm.service'; 
import { Task } from '../models/task.model'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})

export class SidenavComponent {

  @Output() categorySelected = new EventEmitter<string>();
  @Output() openModal = new EventEmitter<void>();

  triggerModal() {
    this.openModal.emit();
  }
  
  categories = ['Personal', 'Study', 'Work', 'Home'];

  showCreateModal = false;

  newTask: Task = {
    title: '',
    description: '',
    category: '',
    date: '',
    completed: false
  };

  selectedCategory: string = 'all';

  constructor(private authService: AuthService, private dbService: DatabaseCommService) {}
  
  onCategoryClick(category: string) {
    this.categorySelected.emit(category);
  }

  logout() {  
    this.authService.logout();
  }

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
