import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AccountInfo } from './account-info.component';
import { AccountService } from '../../services/account.service';

describe('AccountInfo', () => {
  let component: AccountInfo;
  let fixture: ComponentFixture<AccountInfo>;
  let mockActivatedRoute: any;
  let mockAccountService: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      params: of({ customerId: '123' })
    };

    mockAccountService = {
      getFirstAccountInfo: jasmine.createSpy('getFirstAccountInfo').and.returnValue(of({
        accountNumber: 12345,
        customerId: 123,
        customerName: 'Test User',
        balance: 1000.00
      }))
    };

    await TestBed.configureTestingModule({
      imports: [AccountInfo, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AccountService, useValue: mockAccountService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load account info on init', () => {
    expect(component.customerId).toBe(123);
    expect(mockAccountService.getFirstAccountInfo).toHaveBeenCalledWith(123);
  });

  it('should format currency correctly', () => {
    const formatted = component.formatCurrency(1000.50);
    expect(formatted).toBe('₹1000.50');
  });

  it('should handle error when loading account info', () => {
    mockAccountService.getFirstAccountInfo.and.returnValue(of(null));
    component.loadAccountInfo();
    expect(component.accountInfo).toBeNull();
  });
});
