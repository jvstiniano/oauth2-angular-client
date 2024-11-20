import { Component, inject } from '@angular/core';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  
  authService = inject(AuthService);
  message = '';
  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.message = 'Bienvenido a la aplicación, favor iniciar sesión!';
    }else {
      this.authService.logout();
      console.log('logout App');
    }
  }

}
