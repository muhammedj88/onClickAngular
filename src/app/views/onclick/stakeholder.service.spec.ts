import { TestBed, inject } from '@angular/core/testing';

import { StakeholderService } from './stakeholder.service';

describe('StakeholderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StakeholderService]
    });
  });

  it('should be created', inject([StakeholderService], (service: StakeholderService) => {
    expect(service).toBeTruthy();
  }));
});
