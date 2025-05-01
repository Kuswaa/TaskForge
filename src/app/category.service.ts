import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CategoryService
{
  private selectedCategorySubject = new BehaviorSubject<string>('All');
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  setCategory(category: string) {
    this.selectedCategorySubject.next(category);
  }
}
