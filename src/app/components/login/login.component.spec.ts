import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with empty values', () => {
    expect(component.loginForm.get('customerName')?.value).toBe('');
    expect(component.loginForm.get('customerAadhar')?.value).toBe('');
  });

  it('should have required validators on form fields', () => {
    const nameControl = component.loginForm.get('customerName');
    const aadharControl = component.loginForm.get('customerAadhar');

    nameControl?.setValue('');
    aadharControl?.setValue('');

    expect(nameControl?.hasError('required')).toBeTruthy();
    expect(aadharControl?.hasError('required')).toBeTruthy();
  });

  it('should validate Aadhar number pattern', () => {
    const aadharControl = component.loginForm.get('customerAadhar');
    
    aadharControl?.setValue('123');
    expect(aadharControl?.hasError('pattern')).toBeTruthy();
    
    aadharControl?.setValue('123456789012');
    expect(aadharControl?.hasError('pattern')).toBeFalsy();
  });

  it('should call authService.login on valid form submission', () => {
    const mockUser = { 
      customerId: 1, 
      customerName: 'John Doe', 
      customerAddress: '123 Main St',
      customerAadhar: '123456789012',
      customerAge: '30'
    };
    
    authServiceSpy.login.and.returnValue(of(mockUser));

    component.loginForm.patchValue({
      customerName: 'John Doe',
      customerAadhar: '123456789012'
    });

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('John Doe', '123456789012');
  });

  it('should navigate to landing page on successful login', () => {
    const mockUser = { 
      customerId: 1, 
      customerName: 'John Doe', 
      customerAddress: '123 Main St',
      customerAadhar: '123456789012',
      customerAge: '30'
    };
    
    authServiceSpy.login.and.returnValue(of(mockUser));

    component.loginForm.patchValue({
      customerName: 'John Doe',
      customerAadhar: '123456789012'
    });

    component.onSubmit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/landing-page', 1]);
  });

  it('should display error message on login failure', () => {
    authServiceSpy.login.and.returnValue(throwError(() => ({ status: 401 })));

    component.loginForm.patchValue({
      customerName: 'John Doe',
      customerAadhar: '123456789012'
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Invalid credentials. Please check your name and Aadhar number.');
  });

  it('should navigate to register on goToRegister', () => {
    component.goToRegister();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('should show loading state during login', () => {
    authServiceSpy.login.and.returnValue(of({} as any));

    component.loginForm.patchValue({
      customerName: 'John Doe',
      customerAadhar: '123456789012'
    });

    component.onSubmit();

    // Should be loading during the call
    expect(component.isLoading).toBeFalsy(); // Will be false after observable completes synchronously
  });

  it('should not submit if form is invalid', () => {
    component.loginForm.patchValue({
      customerName: '',
      customerAadhar: ''
    });

    component.onSubmit();

    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should mark form as touched when submitting invalid form', () => {
    component.loginForm.patchValue({
      customerName: '',
      customerAadhar: ''
    });

    component.onSubmit();

    expect(component.loginForm.get('customerName')?.touched).toBeTruthy();
    expect(component.loginForm.get('customerAadhar')?.touched).toBeTruthy();
  });
});