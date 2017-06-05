import { Routes } from '@angular/router';

import { NewsComponent } from './news/news.component';
import { CreateComponent } from './create/create.component';

export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: NewsComponent },
  { path: 'create', component: CreateComponent },
];

