import { Client } from '../../models/client';
import { ClientService } from '../../services/client.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ClientFormComponent {
  client: Client = {
    sharedKey: '',
    name: '',
    email: '',
    startDate: '',
    endDate: '',
    phone: '',
  };

  constructor(
    private readonly clientService: ClientService,
    private readonly router: Router
  ) {}

  onSubmit(): void {
    if (!this.validateForm()) {
      return; // Si la validación falla, detenemos el proceso
    }

    this.clientService.addClient(this.client).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Client Created',
          text: 'The client was created successfully!',
        }).then(() => {
          this.router.navigate(['/clients']); // Redirige a la lista de clientes
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err,
        });
        console.error('Error creating client:', err);
      },
    });
  }

  validateForm(): boolean {
    if (!this.client.sharedKey || !this.client.name || !this.client.email) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill out all required fields.',
      });
      return false;
    }

    if (!this.isValidEmail(this.client.email)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
      });
      return false;
    }

    return true;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
