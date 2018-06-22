import { TestBed, inject } from '@angular/core/testing';

import { TaskProjectService } from './task-project.service';

describe('TaskProjectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskProjectService]
    });
  });

  it('should be created', inject([TaskProjectService], (service: TaskProjectService) => {
    expect(service).toBeTruthy();
  }));
});
