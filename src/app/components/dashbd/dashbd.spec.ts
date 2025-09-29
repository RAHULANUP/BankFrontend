import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashbd } from './dashbd';

describe('Select', () => {
  let component: Dashbd;
  let fixture: ComponentFixture<Dashbd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashbd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dashbd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
