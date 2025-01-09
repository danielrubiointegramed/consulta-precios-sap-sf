import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceConsultationService } from '../../services/price-consultation.service';
import { PriceComparison } from 'src/app/interfaces/price-comparison.interface';
import { UpdateResponse } from 'src/app/interfaces/update-response.interface';

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
    });
  }

  /**
   * Consultar precios entre SAP y Salesforce
   */
  onConsult(): void {
    if (this.priceForm.invalid) {
      this.error = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    this.setLoadingState(true);
    const { itemCode, itemName, priceList } = this.priceForm.value;

    this.service.getPriceComparison(itemCode, itemName, priceList).subscribe({
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

  /**
   * Actualizar el job del webservice
   */
  onUpdateJob(): void {
    if (this.priceForm.invalid || !this.comparisonResult) {
      this.error = 'Por favor, completa todos los campos correctamente o realiza una consulta primero.';
      return;
    }

    this.setLoadingState(true);
    const { itemCode, itemName, priceList, newPrice } = this.priceForm.value;

    this.service.updateJob(itemCode, itemName, priceList, newPrice).subscribe({
      next: (response: UpdateResponse) => {
        console.log('Respuesta del servidor:', response);
        if (response.updated) {
          this.comparisonResult = {
            ...this.comparisonResult!,
            salesforce: { price: response.newPrice },
          };
          this.error = null;
        }
        this.setLoadingState(false);
      },
      error: (err) => {
        this.handleError(err, 'Error al actualizar el precio');
      },
    });
  }

  /**
   * Verificar si los precios están sincronizados
   */
  isSynchronized(): boolean {
    return this.comparisonResult?.status === 'Sincronizado' || false;
  }

  /**
   * Manejo de errores centralizado
   * @param error Error recibido
   * @param context Contexto del error
   */
  private handleError(error: unknown, context: string): void {
    console.error(`${context}:`, error);
    this.error = (error as Error).message || `Ocurrió un error inesperado: ${context}`;
    this.setLoadingState(false);
  }

  /**
   * Establece el estado de carga
   * @param isLoading Estado de carga
   */
  private setLoadingState(isLoading: boolean): void {
    this.loading = isLoading;
  }
}
