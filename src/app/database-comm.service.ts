import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, doc, deleteDoc, getDocs } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseCommService {
  private firestore: Firestore = inject(Firestore);

  getTasks(): Observable<any[]> {
    const tasksRef = collection(this.firestore, 'tasks');
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

  addTask(task: any) {
    const tasksRef = collection(this.firestore, 'tasks');
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
