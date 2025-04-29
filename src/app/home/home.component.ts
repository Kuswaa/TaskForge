import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatabaseCommService } from '../database-comm.service';
import { Observable } from 'rxjs';

interface Task {
  title: string;
  description: string;
  category: string;
  date: string;
  completed: boolean;
  id?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tasks$!: Observable<Task[]>;
  tasks: Task[] = [];

  showDetailModal = false;
  showEditModal = false;
  showDropdown = false;

  selectedTaskIndex: number | null = null;
  selectedTask: Task | null = null;
  editTask: Task = this.createEmptyTask();

  constructor(private databaseService: DatabaseCommService) {}

  ngOnInit() {
    this.fetchTasks();
  }

  fetchTasks() {
    this.tasks$ = this.databaseService.getTasks();
    this.tasks$.subscribe(data => {
      this.tasks = data;
    });
  }

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
    if (
      this.selectedTaskIndex !== null &&
      this.selectedTaskIndex >= 0 &&
      this.selectedTask
    ) {
      const taskId = this.selectedTask.id;
      if (taskId) {
        this.databaseService.deleteTask(taskId).subscribe(
          () => {
            this.tasks.splice(this.selectedTaskIndex!, 1);
            this.closeModals();
          },
          (error) => {
            console.error('Error deleting task: ', error);
          }
        );
      }
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
    if (this.selectedTaskIndex !== null && this.selectedTask && this.selectedTask.id) {
      const taskId = this.selectedTask.id;
      const updatedTask = { ...this.editTask };
  
      this.databaseService.updateTask(taskId, updatedTask).subscribe(
        () => {
          this.tasks[this.selectedTaskIndex!] = { ...this.editTask };
          this.closeModals();
        },
        (error) => {
          console.error('Error updating task: ', error);
        }
      );
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

  addNewTask(task: Task) {
    this.databaseService.addTask(task).subscribe(
      (docRef) => {
        console.log('New task added:', docRef);
        this.fetchTasks(); 
      },
      (error) => {
        console.error('Error adding task: ', error);
      }
    );
  }
}
