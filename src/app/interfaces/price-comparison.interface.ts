export interface PriceComparison {
  itemName: string;
  itemCode: string;
  priceList: number;
  sap: {
    price: number;
  };
  salesforce: {
    price: number;
  };
  lastUpdated: string;
  status: string;
}
