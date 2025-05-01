import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, doc, deleteDoc, collectionData } from '@angular/fire/firestore';
import { AuthService } from './auth/auth.service';
import { Task } from './models/task.model';
import { Observable, switchMap, from } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class DatabaseCommService {
  private firestore = inject(Firestore);

  constructor(private authService: AuthService) {}

  private async getUserTasksCollectionPath(): Promise<string> {
    const userId = await this.getUserId();
    return `users/${userId}/tasks`;
  }  

  getUserTasks(): Observable<any[]> {
    return from(this.getUserTasksCollectionPath()).pipe(
      switchMap((path: string) => {
        const tasksRef = collection(this.firestore, path);
        return collectionData(tasksRef, { idField: 'id' }) as Observable<any[]>;
      })
    );
  }

  private async getUserId(): Promise<string> {
    const userId = await this.authService.getCurrentUserIdAsync();
    if (!userId) throw new Error('User not logged in');
    return userId;
  }

  addTask(task: Task): Observable<any> {
    return from(this.getUserTasksCollectionPath()).pipe(
      switchMap(path => {
        if (!path) throw new Error('User not logged in');
        const tasksRef = collection(this.firestore, path);
        return from(addDoc(tasksRef, task));
      })
    );
  }
  
  async updateTask(task: Task): Promise<void> {
    const userId = await this.getUserId();
    if (!task.id) throw new Error('Task ID is missing');
    const taskRef = doc(this.firestore, `users/${userId}/tasks/${task.id}`);
    const { id, ...updatedFields } = task;
    await updateDoc(taskRef, updatedFields);
  }

  async deleteTask(taskId: string): Promise<void> {
    const userId = await this.getUserId();
    const taskRef = doc(this.firestore, `users/${userId}/tasks/${taskId}`);
    await deleteDoc(taskRef);
  }
}
