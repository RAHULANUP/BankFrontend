import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawAmount } from './withdraw-amount';

describe('WithdrawAmount', () => {
  let component: WithdrawAmount;
  let fixture: ComponentFixture<WithdrawAmount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawAmount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawAmount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
