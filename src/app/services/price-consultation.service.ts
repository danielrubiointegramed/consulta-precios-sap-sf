import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PriceComparison } from '../interfaces/price-comparison.interface';
import { UpdateResponse } from '../interfaces/update-response.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PriceConsultationService {
  private readonly compareUrl = environment.apiEndpoints.compareUrl;
  private readonly updateUrl = environment.apiEndpoints.updateUrl;

  constructor(private http: HttpClient) {}

  /**
   * Consulta los precios entre SAP y Salesforce
   * @param product Código del producto
   * @param list Lista de precios
   * @returns Observable con la respuesta de comparación de precios
   */
  getPriceComparison(product: string, list: number): Observable<PriceComparison> {
    const body = { product, list };
    return this.http.post<PriceComparison>(this.compareUrl, body).pipe(
      catchError((error) => this.handleError(error, 'Error al consultar precios'))
    );
  }

  /**
   * Actualiza el precio en Salesforce
   * @param itemCode Código del artículo
   * @param priceList Lista de precios
   * @param newPrice Nuevo precio
   * @returns Observable con la respuesta de la actualización
   */
  updateJob(product: string, list: number, newPrice: number): Observable<UpdateResponse> {
    const body = { product, list, newPrice };

    console.log('Datos enviados al backend:', body);

    return this.http.post<UpdateResponse>(this.updateUrl, body).pipe(
      catchError((error) => this.handleError(error, 'Error al actualizar el precio'))
    );
  }


  /**
   * Maneja errores HTTP de forma centralizada
   * @param error Error HTTP recibido
   * @param context Contexto del error
   * @returns Observable con el error transformado
   */
  private handleError(error: HttpErrorResponse, context: string): Observable<never> {
    console.error(`${context}:`, error);
    const errorMsg = error.error?.message || `Error del servidor: ${error.statusText}`;
    return throwError(() => new Error(errorMsg));
  }
}
