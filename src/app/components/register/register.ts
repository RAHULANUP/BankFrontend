import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Signup } from '../../services/signup';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  isLoading = false;
  errorMessage = '';
  
  constructor(private SignUp:Signup, private authService: AuthService, private router:Router){}
  
  onSubmit(){
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      console.log("Name:",this.registerForm.get('name')?.value);
      console.log("Address:",this.registerForm.get('address')?.value);
      console.log("Aadhar:",this.registerForm.get('aadhar')?.value);
      console.log("Age",this.registerForm.get('age')?.value);
      console.log("SUBMITTING THE FORM...")

      const formData = {
        customerName: this.registerForm.get('name')?.value || '',
        customerAddress: this.registerForm.get('address')?.value || '',
        customerAadhar: this.registerForm.get('aadhar')?.value || '',
        customerAge: this.registerForm.get('age')?.value || ''
      };

      this.SignUp.signup(formData).subscribe({
        next: (value) => {
          console.log("Signup ",value);
          this.isLoading = false;
          // Auto-login the user after registration
          this.authService.login(formData.customerName, formData.customerAadhar).subscribe({
            next: (user) => {
              // Navigate to create account page
              this.router.navigate(['/create-account/',value.customerId]);
            },
            error: (err) => {
              // If auto-login fails, just navigate to create account
              this.router.navigate(['/create-account/',value.customerId]);
            }
          });
        },
        error: (err) => {
          console.log("Registration Error:", err);
          this.isLoading = false;
          this.errorMessage = 'Registration failed. Please try again.';
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
  
  private formBuilder = inject(FormBuilder);
  registerForm = this.formBuilder.group({
    name:['',[Validators.required, Validators.minLength(2)]],
    address:['',[Validators.required, Validators.minLength(5)]],
    aadhar:['',[Validators.required, Validators.pattern(/^\d{12}$/)]],
    age:['',[Validators.required, Validators.min(18), Validators.max(100)]]
  });

  // Getter methods for form validation
  get name() { return this.registerForm.get('name'); }
  get address() { return this.registerForm.get('address'); }
  get aadhar() { return this.registerForm.get('aadhar'); }
  get age() { return this.registerForm.get('age'); }
}
