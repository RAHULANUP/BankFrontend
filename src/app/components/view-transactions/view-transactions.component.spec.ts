import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ViewTransactions } from './view-transactions.component';
import { TransactionService } from '../../services/transaction.service';

describe('ViewTransactions', () => {
  let component: ViewTransactions;
  let fixture: ComponentFixture<ViewTransactions>;
  let mockActivatedRoute: any;
  let mockTransactionService: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      params: of({ customerId: '123' }),
      queryParams: of({ accountNumber: '12345' })
    };

    mockTransactionService = {
      getTransactionsByAccountNumber: jasmine.createSpy('getTransactionsByAccountNumber').and.returnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [ViewTransactions, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: TransactionService, useValue: mockTransactionService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTransactions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load transactions on init', () => {
    expect(component.customerId).toBe(123);
    expect(component.accountNumber).toBe(12345);
    expect(mockTransactionService.getTransactionsByAccountNumber).toHaveBeenCalledWith(12345);
  });

  it('should format date correctly', () => {
    const dateString = '2023-09-29T10:30:00';
    const formattedDate = component.formatDate(dateString);
    expect(formattedDate).toContain('9/29/2023');
  });

  it('should handle invalid dates gracefully', () => {
    expect(component.formatDate('')).toBe('N/A');
    expect(component.formatDate('invalid-date')).toBe('Invalid Date');
  });

  it('should return correct CSS class for transaction types', () => {
    expect(component.getTransactionTypeClass('deposit')).toBe('transaction-credit');
    expect(component.getTransactionTypeClass('withdrawal')).toBe('transaction-debit');
    expect(component.getTransactionTypeClass('transfer')).toBe('transaction-transfer');
    expect(component.getTransactionTypeClass('other')).toBe('transaction-neutral');
    expect(component.getTransactionTypeClass('')).toBe('transaction-neutral');
    expect(component.getTransactionTypeClass(null)).toBe('transaction-neutral');
    expect(component.getTransactionTypeClass(undefined)).toBe('transaction-neutral');
  });
});