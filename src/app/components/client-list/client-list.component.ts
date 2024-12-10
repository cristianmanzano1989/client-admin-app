import { Client } from '../../models/client';
import { ClientService } from '../../services/client.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ClientListComponent implements OnInit {
  dataSource: Client[] = [];
  searchKey: string = ''; // Valor del campo de búsqueda

  constructor(
    private readonly clientService: ClientService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.clientService.getClients().subscribe((clients) => {
      this.dataSource = clients;
    });
  }

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
          icon: 'info',
          title: 'warning',
          text:
            'No clients found for the provided shared key: ' + this.searchKey,
        });
        console.error('Error fetching clients by shared key:', err);
        this.dataSource = [];
      },
    });
  }

  navigateToAddClient(): void {
    this.router.navigate(['/add-client']);
  }
}
