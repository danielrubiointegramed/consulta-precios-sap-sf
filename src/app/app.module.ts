import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { PriceConsultationModule } from './features/price-consultation/price-consultation.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, PriceConsultationModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
