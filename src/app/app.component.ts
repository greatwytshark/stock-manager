import { Component, OnInit } from '@angular/core';
import { Guid } from "guid-typescript";
import { Todo } from 'src/models/todo.model';
import { NgForm } from '@angular/forms';
import { Product } from './product';
import { ProductService } from './product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
declare const M :any;
import {options} from 'materialize-css';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
 public products: Product[];
 public editProduct: Product;
 public deleteProduct: Product;

 constructor(private productService: ProductService) {}

 ngOnInit() {
   this.getProducts();
 }

 public getProducts(): void {
   this.productService.getProducts().subscribe(
     (response: Product[]) => {
       this.products = response;
     },
     (error: HttpErrorResponse) => {
       alert(error.message);
       
     }    
   ); 
  
 }

 public onAddProduct(addForm: NgForm): void {
   this.productService.addProduct(addForm.value).subscribe(
     (response: Product) =>{
       console.log(response);
       this.getProducts();
       addForm.reset();
     },
     (error: HttpErrorResponse) => {
       alert(error.message);
       addForm.reset();
      }
   );
 }

  public onUpdateProduct(product: Product): void {
    this.productService.updateProduct(product).subscribe(
      (response: Product) => {
        console.log(response);
        this.getProducts();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteProduct(productId: number): void {
    this.productService.deleteProduct(productId).subscribe(
      (response: void) => {
        console.log(response);
        this.getProducts();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchProducts(key: string): void{
    const results: Product[] = [];
    for (const product of this.products){
      if (product.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || product.price.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(product);
      }
    }
    this.products = results;
    if (results.length === 0 || !key) {
      this.getProducts();
    }
  }

 public onOpenModal(product: Product, mode: String): void{
   const container = document.getElementById('main-container');
   const button = document.createElement('button');
   button.type = 'button';
   button.style.display = 'none';
   button.setAttribute('class', 'modal-trigger');

   if(mode==='add'){
     button.setAttribute('data-target', 'addProductModal');
   }
   if(mode==='edit'){
     this.editProduct = product;
     button.setAttribute('data-target', 'updateProductModal');
   }
   if (mode === 'delete') {
     this.deleteProduct = product;
     button.setAttribute('data-target', 'deleteProductModal');
   }

   container.appendChild(button);
   button.click();
 }

  public stock = document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, options);
  });


}
