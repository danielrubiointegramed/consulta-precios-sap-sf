import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PriceComparison } from '../interfaces/price-comparison.interface';
import { UpdateResponse } from '../interfaces/update-response.interface';

@Injectable({
  providedIn: 'root',
})
export class PriceConsultationService {
  private readonly apiUrl = 'http://localhost:8000/api.php';

  constructor(private http: HttpClient) {}

  getPriceComparison(itemCode: string, itemName: string, priceList: number): Observable<PriceComparison> {
    const endpoint = `${this.apiUrl}/compare`;
    const body = { itemCode, priceList,itemName };

    return this.http.post<PriceComparison>(endpoint, body).pipe(
      catchError((error) => this.handleError(error, 'Error al consultar precios'))
    );
  }

  updateJob(itemCode: string, itemName: string,priceList: number, newPrice: number): Observable<UpdateResponse> {
    const endpoint = `${this.apiUrl}/update`;
    const body = { itemCode, itemName, priceList, newPrice };

    return this.http.post<UpdateResponse>(endpoint, body).pipe(
      catchError((error) => this.handleError(error, 'Error al actualizar el precio'))
    );
  }


  private handleError(error: HttpErrorResponse, context: string): Observable<never> {
    console.error(`${context}:`, error);
    const errorMsg = error.error?.message || `Error del servidor: ${error.statusText}`;
    return throwError(() => new Error(errorMsg));
  }
}
