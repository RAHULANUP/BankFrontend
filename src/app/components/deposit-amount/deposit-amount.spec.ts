import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositAmount } from './deposit-amount';

describe('DepositAmount', () => {
  let component: DepositAmount;
  let fixture: ComponentFixture<DepositAmount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepositAmount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositAmount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
