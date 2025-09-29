import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, LoginRequest, CustomerDto } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login user successfully', () => {
    const mockUser: CustomerDto = {
      customerId: 1,
      customerName: 'John Doe',
      customerAddress: '123 Main St',
      customerAadhar: '123456789012',
      customerAge: '30'
    };

    service.login('John Doe', '123456789012').subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(localStorage.getItem('currentUser')).toBe(JSON.stringify(mockUser));
    });

    const req = httpMock.expectOne('http://localhost:8080/api/customer/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      customerName: 'John Doe',
      customerAadhar: '123456789012'
    });
    req.flush(mockUser);
  });

  it('should logout user successfully', () => {
    const customerId = 1;
    
    service.logout(customerId).subscribe(response => {
      expect(response).toBe('Customer logged out successfully');
      expect(localStorage.getItem('currentUser')).toBeNull();
    });

    const req = httpMock.expectOne(`http://localhost:8080/api/customer/${customerId}/logout`);
    expect(req.request.method).toBe('POST');
    req.flush('Customer logged out successfully');
  });

  it('should return current user from localStorage on initialization', () => {
    const mockUser: CustomerDto = {
      customerId: 1,
      customerName: 'John Doe',
      customerAddress: '123 Main St',
      customerAadhar: '123456789012',
      customerAge: '30'
    };
    
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    
    // Create new service instance to test constructor
    const newService = new AuthService(TestBed.inject(HttpClientTestingModule) as any);
    
    expect(newService.getCurrentUser()).toEqual(mockUser);
  });

  it('should check if user is logged in', () => {
    expect(service.isLoggedIn()).toBeFalsy();
    
    const mockUser: CustomerDto = {
      customerId: 1,
      customerName: 'John Doe',
      customerAddress: '123 Main St',
      customerAadhar: '123456789012',
      customerAge: '30'
    };
    
    service.login('John Doe', '123456789012').subscribe();
    
    const req = httpMock.expectOne('http://localhost:8080/api/customer/login');
    req.flush(mockUser);
    
    expect(service.isLoggedIn()).toBeTruthy();
  });

  it('should logout locally without API call', () => {
    const mockUser: CustomerDto = {
      customerId: 1,
      customerName: 'John Doe',
      customerAddress: '123 Main St',
      customerAadhar: '123456789012',
      customerAge: '30'
    };
    
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    
    service.logoutLocal();
    
    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(service.getCurrentUser()).toBeNull();
    expect(service.isLoggedIn()).toBeFalsy();
  });

  it('should emit current user changes', (done) => {
    const mockUser: CustomerDto = {
      customerId: 1,
      customerName: 'John Doe',
      customerAddress: '123 Main St',
      customerAadhar: '123456789012',
      customerAge: '30'
    };

    let emissionCount = 0;
    service.currentUser$.subscribe(user => {
      emissionCount++;
      if (emissionCount === 1) {
        expect(user).toBeNull(); // Initial value
      } else if (emissionCount === 2) {
        expect(user).toEqual(mockUser); // After login
        done();
      }
    });

    service.login('John Doe', '123456789012').subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/customer/login');
    req.flush(mockUser);
  });
});