export interface UpdateResponse {
  id: string; // ID del registro en Salesforce
  success: boolean; // Si la operación fue exitosa
  errors: string[]; // Lista de errores, si los hay
  created: boolean; // Indica si el registro fue creado o actualizado
  product: string; // Código del producto (itemCode)
}
