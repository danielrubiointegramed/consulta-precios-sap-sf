import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PriceConsultationComponent } from './price-consultation.component';

@NgModule({
  declarations: [PriceConsultationComponent],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  exports: [PriceConsultationComponent],
})
export class PriceConsultationModule {}
