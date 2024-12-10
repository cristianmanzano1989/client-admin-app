import { ClientFormComponent } from './components/client-form/client-form.component';
import { ClientListComponent } from './components/client-list/client-list.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'clients', component: ClientListComponent },
  { path: 'add-client', component: ClientFormComponent },
  { path: '', redirectTo: '/clients', pathMatch: 'full' },
];
