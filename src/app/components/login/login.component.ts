import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  returnUrl = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      customerAadhar: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]]
    });
  }

  ngOnInit(): void {
    // Get the return URL from query parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { customerName, customerAadhar } = this.loginForm.value;

      this.authService.login(customerName, customerAadhar).subscribe({
        next: (user) => {
          console.log('Login successful:', user);
          this.isLoading = false;
          // Navigate to return URL or landing page with customer ID
          if (this.returnUrl && this.returnUrl !== '/') {
            // If return URL contains :customerId, replace it with actual customer ID
            const finalUrl = this.returnUrl.replace(':customerId', user.customerId.toString());
            this.router.navigateByUrl(finalUrl);
          } else {
            this.router.navigate(['/landing-page', user.customerId]);
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.isLoading = false;
          if (error.status === 401) {
            this.errorMessage = 'Invalid credentials. Please check your name and Aadhar number.';
          } else {
            this.errorMessage = 'Login failed. Please try again later.';
          }
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  // Getter methods for form validation
  get customerName() { return this.loginForm.get('customerName'); }
  get customerAadhar() { return this.loginForm.get('customerAadhar'); }
}