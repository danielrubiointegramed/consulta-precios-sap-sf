export interface PriceComparison {
  itemCode: string;
  itemName: string;
  priceList: number;
  sap: {
    price: string;
  };
  salesforce: {
    price: string;
  };
  lastUpdated: string;
  status: string;
}
