import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatabaseCommService } from '../database-comm.service';
import { Task } from '../models/task.model';
import { AuthService } from '../auth/auth.service';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
import { CategoryService } from '../category.service';

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
  filteredTasks: any[] = [];
  userId: string | null = null;
  selectedCategory: string = 'All';

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
    private firestore: Firestore,
    private categoryService: CategoryService
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

    this.categoryService.selectedCategory$.subscribe(category => {
      this.onCategorySelected(category);
    });
  }

  onCategorySelected(category: string) {
    this.selectedCategory = category;
    this.filterTasks();
  }

  filterTasks() {
    if (this.selectedCategory === 'All' || !this.selectedCategory) {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter(
        task => task.category?.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }
    console.log(`Filtering by category: ${this.selectedCategory}, matched: ${this.filteredTasks.length}`);
  }

  listenToTasks(): void {
    if (!this.userId)
    {
      console.warn('No userId yet');
      return;
    }

    console.log('Listening to tasks for userId:', this.userId);

    const tasksRef = collection(this.firestore, `users/${this.userId}/tasks`);
    this.unsubscribeSnapshot?.(); 

    this.unsubscribeSnapshot = onSnapshot(tasksRef, snapshot => {
      this.tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Task));
      console.log('Fetched tasks check:', this.tasks);  
      this.filterTasks();
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
