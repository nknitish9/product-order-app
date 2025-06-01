export interface Product {
  name: string;
  quantity: number;
}

export interface ProductRow {
  id: number;
  selectedProduct: string;
  selectedQuantity: number;
  isProductSelected: boolean;
  isQuantitySelected: boolean;
}