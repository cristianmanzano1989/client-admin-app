import { Client } from '../models/client';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
// Usa el entorno para la URL base

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly apiUrl = 'http://localhost:8001/api/clients'; // URL base del backend

  constructor(private readonly http: HttpClient) {}

  /**
   * Obtener todos los clientes
   * @returns
   */
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/getClients`);
  }

  /**
   * Obtener un cliente por sharedKey
   * @param sharedKey
   * @returns
   */
  getClientBySharedKey(sharedKey: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/searchClient/${sharedKey}`);
  }

  /**
   * Crear un nuevo cliente
   * @param client
   * @returns
   */
  addClient(client: Client): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/createClient`, client)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    // If the error status is 400 (Bad Request), we check the response for specific error codes
    if (
      error.status === 400 &&
      error.error.data &&
      error.error.data.respondeCode === '01'
    ) {
      // Handle duplicate client error
      return throwError(
        () => new Error('The client with that shared key already exists.')
      );
    } else {
      // For other errors, return a general error message
      return throwError(
        () => new Error('Something went wrong! Please try again.')
      );
    }
  }
}
