import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, doc, deleteDoc, getDocs } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { Task } from './models/task.model'; 

@Injectable({
  providedIn: 'root',
})
export class DatabaseCommService {

  constructor(private firestore: Firestore = inject(Firestore) , private authService: AuthService) {}


getTasks(): Observable<any[]> {
  const userId = this.authService.getCurrentUserId();
  if (!userId) return of([]);

  const tasksRef = collection(this.firestore, `users/${userId}/tasks`);
  return new Observable(observer => {
    getDocs(tasksRef)
      .then(snapshot => {
        const tasks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        observer.next(tasks);
      })
      .catch(error => observer.error(error));
  });
}

  addTask(task: Task): Observable<any> {
  const userId = this.authService.getCurrentUserId();
  if (!userId) return from(Promise.reject('User not logged in'));

  const tasksRef = collection(this.firestore, `users/${userId}/tasks`);
  return from(addDoc(tasksRef, task));
}

  updateTask(id: string, updatedTask: any) {
    const taskRef = doc(this.firestore, 'tasks', id);
    return from(updateDoc(taskRef, updatedTask));
  }

  deleteTask(id: string) {
    const taskRef = doc(this.firestore, 'tasks', id);
    return from(deleteDoc(taskRef));
  }
}
