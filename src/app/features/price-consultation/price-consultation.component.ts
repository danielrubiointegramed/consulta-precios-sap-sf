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

  constructor(
    private fb: FormBuilder,
    private service: PriceConsultationService
  ) {
    this.priceForm = this.fb.group({
      itemCode: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9/\\-_.\\s]+$')],
      ],
      priceList: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      newPrice: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,4})?$')],
      ],
      environment: ['LIVE'],
    });
  }

  onConsult(): void {
    if (this.priceForm.invalid) {
      this.error = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    const { itemCode, priceList } = this.priceForm.value;

    this.service.getPriceComparison(itemCode, priceList).subscribe({
      next: (result: PriceComparison) => {
        console.log('Resultado de comparación:', result);

        // Validar propiedades correctamente
        if (result && result.sap?.price && result.salesforce?.price) {
          this.comparisonResult = result;
          this.error = null;
        } else {
          this.error = 'El resultado de la comparación no es válido.';
          this.comparisonResult = null;
        }
        this.setLoadingState(false);
      },
      error: (err) => {
        this.handleError(err, 'Error al consultar precios');
      },
    });
    console.log('Valor de Item Code:', this.priceForm.get('itemCode')?.value);
  }

  onUpdateJob(): void {
    if (this.priceForm.invalid || !this.comparisonResult) {
      this.error = 'Por favor, realiza una consulta antes de actualizar el precio.';
      return;
    }

    const { itemCode, priceList, newPrice } = this.priceForm.value;

    console.log('Datos enviados al servicio de actualización:', {
      itemCode,
      priceList,
      newPrice,
    });

    this.setLoadingState(true);

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
    if (!this.comparisonResult) {
      return false;
    }
    return (
      this.comparisonResult.sap.price === this.comparisonResult.salesforce.price
    );
  }

  private handleError(error: unknown, context: string): void {
    console.error(`${context}:`, error);
    this.error =
      (error as HttpErrorResponse).error?.message ||
      `Ocurrió un error inesperado: ${context}`;
    this.setLoadingState(false);
  }

  private setLoadingState(isLoading: boolean): void {
    this.loading = isLoading;
  }
}
