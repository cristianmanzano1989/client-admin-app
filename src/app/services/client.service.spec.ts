import { ClientService } from './client.service';
import { Client } from '../models/client';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ClientService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all clients', () => {
    const mockClients: Client[] = [
      {
        sharedKey: 'key1',
        name: 'Test Client 1',
        email: 'test1@test.com',
        phone: '1234567890',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
      },
      {
        sharedKey: 'key2',
        name: 'Test Client 2',
        email: 'test2@test.com',
        phone: '0987654321',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
      },
    ];

    service.getClients().subscribe((clients) => {
      expect(clients).toEqual(mockClients);
    });

    const req = httpMock.expectOne(
      'http://localhost:8001/api/clients/getClients'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockClients);
  });

  it('should get client by shared key', () => {
    const mockClient: Client = {
      sharedKey: 'key1',
      name: 'Test Client',
      email: 'test@test.com',
      phone: '1234567890',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
    };

    service.getClientBySharedKey('key1').subscribe((client) => {
      expect(client).toEqual(mockClient);
    });

    const req = httpMock.expectOne(
      'http://localhost:8001/api/clients/searchClient/key1'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockClient);
  });

  it('should add new client', () => {
    const newClient: Client = {
      sharedKey: 'key1',
      name: 'Test Client',
      email: 'test@test.com',
      phone: '1234567890',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
    };

    service.addClient(newClient).subscribe((response) => {
      expect(response).toEqual({ message: 'Client created successfully' });
    });

    const req = httpMock.expectOne(
      'http://localhost:8001/api/clients/createClient'
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newClient);
    req.flush({ message: 'Client created successfully' });
  });

  it('should handle duplicate client error', () => {
    const newClient: Client = {
      sharedKey: 'key1',
      name: 'Test Client',
      email: 'test@test.com',
      phone: '1234567890',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
    };

    service.addClient(newClient).subscribe({
      error: (error) => {
        expect(error.message).toBe(
          'The client with that shared key already exists.'
        );
      },
    });

    const req = httpMock.expectOne(
      'http://localhost:8001/api/clients/createClient'
    );
    req.flush(
      { data: { respondeCode: '01' } },
      { status: 400, statusText: 'Bad Request' }
    );
  });

  it('should handle general error', () => {
    const newClient: Client = {
      sharedKey: 'key1',
      name: 'Test Client',
      email: 'test@test.com',
      phone: '1234567890',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
    };

    service.addClient(newClient).subscribe({
      error: (error) => {
        expect(error.message).toBe('Something went wrong! Please try again.');
      },
    });

    const req = httpMock.expectOne(
      'http://localhost:8001/api/clients/createClient'
    );
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
