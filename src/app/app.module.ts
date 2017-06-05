import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routes';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { NewsComponent } from './news/news.component';
import { requestOptionsProvider } from './news/services/default-request-options.service.ts';

import { CreateComponent } from './create/create.component';

@NgModule({
  declarations: [
    AppComponent,
    NewsComponent,
    CreateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: true })
  ],
  providers: [
    requestOptionsProvider
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

}
