import { Component, OnInit } from '@angular/core';
import { Product, ProductRow } from '../../models/product.model';
import { TextToSpeechService } from '../../services/text-to-speech.service';

@Component({
  selector: 'app-product-order',
  templateUrl: './product-order.component.html',
  styleUrls: ['./product-order.component.css']
})
export class ProductOrderComponent implements OnInit {
  availableProducts: string[] = ['Pencil', 'Eraser', 'Pens', 'Notebook', 'Ruler', 'Marker', 'Stapler', 'Scissors'];
  quantities: number[] = [0, 1, 2, 3, 4, 5];
  productRows: ProductRow[] = [];
  finalOrder: Product[] = [];
  showOrderGrid: boolean = false;
  maxRows: number = 8;
  nextRowId: number = 1;

  constructor(private textToSpeechService: TextToSpeechService) {}

  ngOnInit(): void {
    this.addNewRow();
  }

  addNewRow(): void {
    if (this.productRows.length < this.maxRows) {
      const newRow: ProductRow = {
        id: this.nextRowId++,
        selectedProduct: '',
        selectedQuantity: -1,
        isProductSelected: false,
        isQuantitySelected: false
      };
      this.productRows.push(newRow);
    }
  }

  onProductSelect(rowIndex: number): void {
    const row = this.productRows[rowIndex];
    if (row.selectedProduct) {
      row.isProductSelected = true;
      
      if (rowIndex === this.productRows.length - 1 && this.productRows.length < this.maxRows) {
        this.addNewRow();
      }
    } else {
      row.isProductSelected = false;
    }
  }

  onQuantitySelect(rowIndex: number): void {
    const row = this.productRows[rowIndex];
    if (row.selectedQuantity !== -1) {
      row.isQuantitySelected = true;
    } else {
      row.isQuantitySelected = false;
    }
  }

  addToOrder(rowIndex: number): void {
    const row = this.productRows[rowIndex];
    
    if (!row.isProductSelected || !row.selectedProduct) {
      alert('Please select a product first!');
      return;
    }
    
    if (!row.isQuantitySelected || row.selectedQuantity === -1) {
      alert('Please select a quantity!');
      return;
    }

    const existingProductIndex = this.finalOrder.findIndex(p => p.name === row.selectedProduct);
    if (existingProductIndex !== -1) {
      this.finalOrder[existingProductIndex].quantity += row.selectedQuantity;
    } else {
      this.finalOrder.push({
        name: row.selectedProduct,
        quantity: row.selectedQuantity
      });
    }

    row.selectedProduct = '';
    row.selectedQuantity = -1;
    row.isProductSelected = false;
    row.isQuantitySelected = false;
  }

  showOrder(): void {
    this.productRows = this.productRows.filter(row => 
      row.isProductSelected && row.isQuantitySelected && 
      row.selectedProduct && row.selectedQuantity !== -1
    );
    
    this.showOrderGrid = true;
  }

  readOrder(): void {
    if (this.finalOrder.length === 0) {
      this.textToSpeechService.speakText('Your order is empty');
      return;
    }

    let orderText = 'Your order contains: ';
    this.finalOrder.forEach((product, index) => {
      if (product.quantity === 1) {
        orderText += `${product.quantity} ${product.name}`;
      } else {
        orderText += `${product.quantity} ${product.name}s`;
      }
      
      if (index < this.finalOrder.length - 1) {
        orderText += ', ';
      }
    });

    this.textToSpeechService.speakText(orderText);
  }

  getAvailableProducts(currentRowIndex: number): string[] {
    const selectedInRows = this.productRows
      .filter((row, index) => index !== currentRowIndex && row.isProductSelected)
      .map(row => row.selectedProduct);

    const selectedInOrder = this.finalOrder.map(p => p.name);

    const allSelected = [...selectedInRows, ...selectedInOrder];
    
    return this.availableProducts.filter(product => !allSelected.includes(product));
  }

  resetOrder(): void {
    this.finalOrder = [];
    this.productRows = [];
    this.showOrderGrid = false;
    this.nextRowId = 1;
    this.addNewRow();
  }

  getVisibleRows(): ProductRow[] {
    const filledRows = this.productRows.filter(row => row.isProductSelected || row.isQuantitySelected);
    const emptyRows = this.productRows.filter(row => !row.isProductSelected && !row.isQuantitySelected);
    
    if (emptyRows.length > 0 && filledRows.length < this.maxRows) {
      return [...filledRows, emptyRows[0]];
    }
    
    return filledRows;
  }

  isAddButtonEnabled(row: ProductRow): boolean {
    return row.isProductSelected && row.isQuantitySelected && 
           row.selectedProduct !== '' && row.selectedQuantity !== -1;
  }

  shouldShowOrderButton(): boolean {
    return this.finalOrder.length > 0 && !this.showOrderGrid;
  }
}