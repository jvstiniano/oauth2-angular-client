import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-authorized',
  standalone: true,
  imports: [],
  templateUrl: './authorized.component.html',
  styleUrl: './authorized.component.css'
})
export class AuthorizedComponent {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    console.log('On AuthorizedComponent.ngOnInit');
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.authService.handleCallback(code).subscribe({
          next: () => this.router.navigate(['/home']),
          error: () => this.router.navigate(['/login'])
        });
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

}
