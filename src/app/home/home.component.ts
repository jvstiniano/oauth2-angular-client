import { Component, inject } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  message = '';

  authService = inject(AuthService);
  router = inject(Router);
  
  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.message = 'Bienvenido acceso validado!';
    }else {
      this.router.navigate(['/login']);
    }
  }

}
