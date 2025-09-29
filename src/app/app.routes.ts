import { Routes } from '@angular/router';
import { Dashbd } from './components/dashbd/dashbd';
import { Transfer } from './components/transfer/transfer';
import { DepositAmount } from './components/deposit-amount/deposit-amount';
import { Register } from './components/register/register';
import { WithdrawAmount } from './components/withdraw-amount/withdraw-amount';
import { LandingPage } from './landing-page/landing-page';
import { CreateAccount } from './components/create-account/create-account';
import { ViewTransactions } from './components/view-transactions/view-transactions.component';
import { AccountInfo } from './components/account-info/account-info.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

export const routes: Routes = [
    // Public routes (accessible to everyone)
    {path: '', component: LandingPage},
    
    // Guest routes (only for non-authenticated users)
    {path: 'login', component: LoginComponent, canActivate: [GuestGuard]},
    {path: 'register', component: Register, canActivate: [GuestGuard]},
    
    // Protected routes (require authentication)
    {path: 'landing-page/:customerId', component: LandingPage, canActivate: [AuthGuard]},
    {path: 'create-account/:customerId', component: CreateAccount, canActivate: [AuthGuard]},
    {path: 'dashbd/:accountNo', component: Dashbd, canActivate: [AuthGuard]},
    {path: 'deposit/:customerId', component: DepositAmount, canActivate: [AuthGuard]},
    {path: 'withdraw/:customerId', component: WithdrawAmount, canActivate: [AuthGuard]},
    {path: 'transfer/:customerId', component: Transfer, canActivate: [AuthGuard]},
    {path: 'view-transactions/:customerId', component: ViewTransactions, canActivate: [AuthGuard]},
    {path: 'account-info/:customerId', component: AccountInfo, canActivate: [AuthGuard]},
    
    // Wildcard route - redirect to home
    {path: '**', redirectTo: ''}
];
