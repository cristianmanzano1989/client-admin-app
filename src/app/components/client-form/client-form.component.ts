import { Client } from '../../models/client';
import { ClientService } from '../../services/client.service';
import { LoggerService } from '../../services/logger.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

/**
 * Component that handles the client creation form.
 * Provides functionality for adding new clients with validation.
 *
 * @class ClientFormComponent
 * @exports ClientFormComponent
 *
 * @property {Client} client - The client object containing form data
 *
 * @method onSubmit - Handles the form submission and client creation process
 * @method validateForm - Validates the required fields and email format
 * @method isValidEmail - Validates email format using regex
 *
 * @requires ClientService - Service for client-related API operations
 * @requires Router - Angular router for navigation
 * @requires LoggerService - Service for logging operations
 * @requires Swal - SweetAlert2 for displaying user notifications
 */
/**
 * Component for managing client form operations.
 * Provides functionality for creating new clients with validation.
 */
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
    private readonly router: Router,
    private readonly logger: LoggerService
  ) {}

  /**
   * Handles the submission of the client form.
   * Validates the form first and if valid, attempts to create a new client.
   * Shows success/error feedback to user via SweetAlert2 notifications.
   * On successful creation, redirects to the clients list view.
   *
   * @throws {Error} If the client creation request fails
   * @returns {void}
   */
  onSubmit(): void {
    this.logger.log('Attempting to submit client form');
    if (!this.validateForm()) {
      this.logger.warn('Form validation failed');
      return; // Si la validación falla, detenemos el proceso
    }

    this.clientService.addClient(this.client).subscribe({
      next: () => {
        this.logger.log('Client created successfully');
        Swal.fire({
          icon: 'success',
          title: 'Client Created',
          text: 'The client was created successfully!',
        }).then(() => {
          this.router.navigate(['/clients']); // Redirige a la lista de clientes
        });
      },
      error: (err) => {
        this.logger.error('Error creating client:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err,
        });
        console.error('Error creating client:', err);
      },
    });
  }

  /**
   * Validates the client form data before submission.
   * Checks for required fields and email format validity.
   * Shows warning alerts to the user if validation fails.
   *
   * @returns {boolean} True if form is valid, false otherwise
   * @throws {SweetAlert2} Displays warning alert when validation fails
   * @example
   * if (this.validateForm()) {
   *   // proceed with form submission
   * }
   */
  validateForm(): boolean {
    if (!this.client.sharedKey || !this.client.name || !this.client.email) {
      this.logger.warn('Required fields missing');
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill out all required fields.',
      });
      return false;
    }

    if (!this.isValidEmail(this.client.email)) {
      this.logger.warn('Invalid email format:', this.client.email);
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
      });
      return false;
    }

    this.logger.log('Form validation successful');
    return true;
  }

  /**
   * Validates if the provided string is a valid email address format.
   * Uses a regular expression pattern to check for basic email structure.
   *
   * @param email - The email string to validate
   * @returns `true` if the email matches valid format, `false` otherwise
   *
   * @example
   * ```typescript
   * isValidEmail("test@example.com") // returns true
   * isValidEmail("invalid.email") // returns false
   * ```
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
