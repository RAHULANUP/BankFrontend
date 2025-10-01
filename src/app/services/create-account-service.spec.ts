import { TestBed } from '@angular/core/testing';

import { CreateAccountService } from './create-account-service';

describe('CreateAccount', () => {
  let service: CreateAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
