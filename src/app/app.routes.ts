import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { HomeComponent } from './home/home.component';
import { AuthorizedComponent } from './authorized/authorized.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: WelcomeComponent },
    { path: 'logout', component: WelcomeComponent },
    { path: 'authorized', component: AuthorizedComponent },
    { path: 'home', component: HomeComponent },
    
];
