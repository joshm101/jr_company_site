import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoot } from './components/app.component';

@NgModule({
  imports: [BrowserModule],
  declarations: [AppRoot],
  bootstrap: [AppRoot]
})
export class AppModule { }
