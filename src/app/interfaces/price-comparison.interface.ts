export interface PriceComparison {
  itemCode: string; // Código del artículo
  itemName: string; // Nombre del artículo
  priceList: number; // Lista de precios
  sap: {
    price: string; // Precio en SAP
  };
  salesforce: {
    price: string; // Precio en Salesforce
  };
  lastUpdated: string; // Fecha de última modificación
  status: string; // Sincronizado o Desactualizado
}
