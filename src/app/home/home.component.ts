import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatabaseCommService } from '../database-comm.service';
import { Observable, of } from 'rxjs';
import { Task } from '../models/task.model';
import { AuthService } from '../auth/auth.service';  
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

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

  constructor(private databaseService: DatabaseCommService, private authService: AuthService, private firestore: Firestore) {}

  ngOnInit() {
    this.tasks$ = this.databaseService.getTasks();
  } 

  getTasks() {  
    const userId = this.authService.getCurrentUserId();
    const tasksRef = collection(this.firestore, `users/${userId}/tasks`);
  
    getDocs(tasksRef).then(snapshot => {
      const tasks: Task[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Task,
      }));
      this.tasks = tasks;
    }).catch(error => {
      console.error('Error fetching tasks:', error);
    });
  }
  
  get totalTasks(): number {
    return this.tasks.length;
  }
  
  get pendingTasks(): number {
    return this.tasks.filter(task => !task.completed).length;
  }
  
  get completedTasks(): number {
    return this.tasks.filter(task => task.completed).length;
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
        this.getTasks(); 
      },
      (error) => {
        console.error('Error adding task: ', error);
      }
    );
  }
}
