export interface StockReserveItem {
  productId: number;
  quantity: number;
}

export interface StockReservedItemPrice {
  productId: number;
  quantity: number;
  unitPrice: string;
}

export interface StockReserveResult {
  success: boolean;
  reason?: string;
  items?: StockReservedItemPrice[];
}

export interface StockReserveRequest {
  orderId: number;
  items: StockReserveItem[];
}

export interface StockReleaseRequest {
  orderId: number;
}