import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceConsultationService } from '../../services/price-consultation.service';
import { PriceComparison } from 'src/app/interfaces/price-comparison.interface';
import { UpdateResponse } from 'src/app/interfaces/update-response.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'price-consultation',
  templateUrl: './price-consultation.component.html',
  styleUrls: ['./price-consultation.component.scss'],
})
export class PriceConsultationComponent {
  priceForm: FormGroup;
  loading: boolean = false;
  error: string | null = null;
  comparisonResult: PriceComparison | null = null;

  constructor(private fb: FormBuilder, private service: PriceConsultationService) {
    this.priceForm = this.fb.group({
      itemCode: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]], // Solo alfanumérico
      priceList: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Entero
      newPrice: ['', [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,4})?$')]], // Hasta 4 decimales
      environment: ['LIVE'], // Valor por defecto
    });
  }

  onConsult(): void {
    if (this.priceForm.invalid) {
      this.error = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    const { itemCode, priceList } = this.priceForm.value;

    // Verifica los datos enviados
    console.log('Datos enviados al servicio de comparación:', { itemCode, priceList });

    this.setLoadingState(true);

    this.service.getPriceComparison(itemCode, priceList).subscribe({
      next: (result: PriceComparison) => {
        this.comparisonResult = result;
        this.error = null;
        this.setLoadingState(false);
      },
      error: (err) => {
        this.handleError(err, 'Error al consultar precios');
      },
    });
  }


  onUpdateJob(): void {
    if (this.priceForm.invalid || !this.comparisonResult) {
      this.error = 'Por favor, completa todos los campos correctamente o realiza una consulta primero.';
      return;
    }

    this.setLoadingState(true);
    const { itemCode, priceList, newPrice } = this.priceForm.value;

    console.log('Datos enviados al servicio de actualización:', { itemCode, priceList, newPrice });

    this.service.updateJob(itemCode, priceList, newPrice).subscribe({
      next: (response: UpdateResponse) => {
        console.log('Respuesta del servidor:', response);
        if (response.success) {
          this.comparisonResult = {
            ...this.comparisonResult!,
            salesforce: { price: newPrice },
          };
          this.error = null;
        } else {
          this.error = `Errores: ${response.errors.join(', ')}`;
        }
        this.setLoadingState(false);
      },
      error: (err) => {
        this.handleError(err, 'Error al actualizar el precio');
      },
    });
  }


  isSynchronized(): boolean {
    return this.comparisonResult?.status === 'Sincronizado' || false;
  }

  private handleError(error: unknown, context: string): void {
    console.error(`${context}:`, error);
    this.error = (error as HttpErrorResponse).error?.message || `Ocurrió un error inesperado: ${context}`;
    this.setLoadingState(false);
  }


  private setLoadingState(isLoading: boolean): void {
    this.loading = isLoading;
  }
}
