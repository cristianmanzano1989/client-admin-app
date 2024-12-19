import { Client } from '../../models/client';
import { ClientService } from '../../services/client.service';
import { LoggerService } from '../../services/logger.service';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import Swal from 'sweetalert2';

/**
 * Component that handles the display and management of client list.
 * Provides functionality for searching clients by shared key and navigation to add new clients.
 *
 * @component
 *
 * @property {Client[]} dataSource - Array that stores the list of clients to be displayed
 * @property {string} searchKey - Stores the search term for filtering clients by shared key
 *
 * @method ngOnInit - Lifecycle hook that fetches initial client data on component initialization
 * @method searchBySharedKey - Searches for a client using the provided shared key
 * @method navigateToAddClient - Navigates to the add client form
 *
 * @dependencies
 * - ClientService - Service for handling client-related API calls
 * - Router - Angular router for navigation
 * - CommonModule - Angular common module for basic directives
 * - FormsModule - Angular forms module for form handling
 */
@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ClientListComponent implements OnInit, OnDestroy {
  dataSource: Client[] = [];
  searchKey: string = ''; // Valor del campo de búsqueda
  private readonly routerSubscription: any;

  constructor(
    private readonly clientService: ClientService,
    private readonly router: Router,
    private readonly loggingService: LoggerService
  ) {
    // Add router event subscription
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url === '/clients') {
        this.loadClients();
      }
    });
  }

  ngOnInit(): void {
    this.loadClients();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private loadClients(): void {
    this.clientService.getClients().subscribe((clients) => {
      this.dataSource = clients;
    });
  }

  /**
   * Searches for a client using the provided shared key.
   * If the search key is empty or contains only whitespace, displays an info message.
   * Updates the data source with the found client or an empty array if no client is found.
   * Displays an error message if the search fails.
   *
   * @remarks
   * The search is performed through the client service and results are shown in the data table.
   *
   * @throws Will display an error message if the API call fails
   */
  searchBySharedKey(): void {
    if (!this.searchKey.trim()) {
      Swal.fire({
        icon: 'info',
        title: 'Info',
        text: 'Please enter a shared key to search.',
      });
      return;
    }

    this.clientService.getClientBySharedKey(this.searchKey).subscribe({
      next: (response) => {
        // Si encuentra resultados, actualiza la lista
        this.dataSource = response ? [response] : [];
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Warning',
          text:
            'No clients found for the provided shared key: ' + this.searchKey,
        });
        this.loggingService.error('Error fetching clients by shared key:', err);
        this.dataSource = [];
      },
    });
  }

  /**
   * Navigates to the 'add client' view using Angular's Router.
   * This method triggers a navigation to the '/add-client' route when called.
   */
  navigateToAddClient(): void {
    this.router.navigate(['/add-client']);
  }

  /**
   * Handles the blur event of the search input.
   * If the search field is empty, loads all clients.
   */
  onSearchBlur(): void {
    if (!this.searchKey.trim()) {
      this.loadClients();
    } else {
      this.clientService.getClientBySharedKey(this.searchKey).subscribe({
        next: (response) => {
          // Si encuentra resultados, actualiza la lista
          this.dataSource = response ? [response] : [];
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Warning',
            text:
              'No clients found for the provided shared key: ' + this.searchKey,
          });
          this.loggingService.error(
            'Error fetching clients by shared key:',
            err
          );
          this.dataSource = [];
        },
      });
    }
  }
}
