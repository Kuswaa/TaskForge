import { TestBed } from '@angular/core/testing';

import { DatabaseCommService } from './database-comm.service';

describe('DatabaseCommService', () => {
  let service: DatabaseCommService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseCommService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
