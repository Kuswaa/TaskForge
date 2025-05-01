import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatabaseCommService } from '../database-comm.service';
import { Task } from '../models/task.model';
import { AuthService } from '../auth/auth.service';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy
{
  tasks: Task[] = [];
  userId: string | null = null;


  showDropdown: string | null = null;
  showEditModal = false;
  editTask: Task = {
    id: '',
    title: '',
    description: '',
    date: '',
    category: '',
    completed: false
  };

  private unsubscribeSnapshot: (() => void) | null = null;

  constructor(
    private databaseService: DatabaseCommService,
    private authService: AuthService,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user)
      {
        this.userId = user.uid;
        this.listenToTasks();
      }
      else
      {
        this.userId = null;
        this.tasks = [];
        this.unsubscribeSnapshot?.();
      }
    });
  }

  listenToTasks(): void {
    if (!this.userId) return;

    const tasksRef = collection(this.firestore, `users/${this.userId}/tasks`);
    this.unsubscribeSnapshot?.(); 

    this.unsubscribeSnapshot = onSnapshot(tasksRef, snapshot => {
      this.tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Task));
    });
  }

  toggleDropdown(taskId: string): void {
    this.showDropdown = this.showDropdown === taskId ? null : taskId;
  }

  openEditModal(task: Task): void {
    this.editTask = { ...task }; 
    this.showEditModal = true;
    this.showDropdown = null;
  }

  submitEdit(): void {
    this.databaseService.updateTask(this.editTask).then(() => {
      this.showEditModal = false;
    }).catch(err => {
      console.error('Edit failed:', err);
    });
  }
  
  deleteTask(taskId: string): void {
    this.databaseService.deleteTask(taskId).catch(err => {
      console.error('Delete failed:', err);
    });
  }
  
  markComplete(task: Task): void {
    const updatedTask = { ...task, completed: !task.completed };
    this.databaseService.updateTask(updatedTask).catch(err => {
      console.error('Failed to mark task complete:', err);
    });
  }
  

  ngOnDestroy(): void {
    this.unsubscribeSnapshot?.();
  }
}
