import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

interface Task
{
  title: string;
  description: string;
  category: string;
  date: string;
  completed: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent
{
  tasks: Task[] = [
    { title: "Task 1", description: "Description 1", category: "Work", date: "2025-05-01", completed: false },
    { title: "Task 2", description: "Description 2", category: "Personal", date: "2025-06-01", completed: false }
  ];

  showDetailModal = false;
  showEditModal = false;
  showDropdown = false;

  selectedTaskIndex: number | null = null;
  selectedTask: Task | null = null;
  editTask: Task = this.createEmptyTask();

  openDetailModal(index: number): void {
    this.selectedTaskIndex = index;
    this.selectedTask = { ...this.tasks[index] };
    this.showDetailModal = true;
  }

  closeModals(): void {
    this.showDetailModal = false;
    this.showEditModal = false;
    this.showDropdown = false;
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  deleteTask(): void {
    if (this.selectedTaskIndex !== null) {
      this.tasks.splice(this.selectedTaskIndex, 1);
      this.closeModals();
    }
  }

  openEditModal(): void {
    if (this.selectedTaskIndex === null || this.selectedTask === null) return;
    this.editTask = { ...this.selectedTask };
    this.showEditModal = true;
    this.showDetailModal = false;
    this.showDropdown = false;
  }

  submitEdit(): void {
    if (this.selectedTaskIndex !== null) {
      this.tasks[this.selectedTaskIndex] = { ...this.editTask };
      this.closeModals();
    }
  }

  createEmptyTask(): Task {
    return {
      title: '',
      description: '',
      category: '',
      date: '',
      completed: false
    };
  }
}