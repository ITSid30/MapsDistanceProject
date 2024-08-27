import { TestBed } from '@angular/core/testing';

import { OlaMapsServiceService } from './ola-maps-service.service';

describe('OlaMapsServiceService', () => {
  let service: OlaMapsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OlaMapsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
