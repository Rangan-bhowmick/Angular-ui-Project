import { Component, OnInit , ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { ProductService } from '../product.service';
import { Iproducts } from '../products';


const CACHE_KEY = "httpRepoCache";


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {

  public products = []; 
  public errorMessage;
  
  displayedColumns: string[] = ['productId', 'productCategory','productName', 'productDescriction','units', 'action'];
  dataSource = new MatTableDataSource<Iproducts>([]);

  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _productService : ProductService, public dialog: MatDialog) { 

    this.dataSource.data = JSON.parse(localStorage[CACHE_KEY]);

  }

  ngOnInit() {
    this.refresh();
  }

  refresh(){
    this._productService.getProducts()
    .subscribe((data) => {
      localStorage[CACHE_KEY] = JSON.stringify(data);
      this.dataSource.data = JSON.parse(localStorage[CACHE_KEY] || []);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      
    }, error => {
     this.errorMessage = error;
     alert(this.errorMessage);
    });
  }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.addRowData(result.data);
      }else if(result.event == 'Update'){
        this.updateRowData(result.data);
      }else if(result.event == 'Delete'){
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(row_obj){
    this._productService.addProducts(row_obj)
    .subscribe((data) => {
      console.log("New data Added");
      this.refresh();
    }, error => {
      this.errorMessage = error;
     alert(this.errorMessage);
    });
    this.table.renderRows();
    
  }


  updateRowData(row_obj){
    this._productService.updateProducts(row_obj)
    .subscribe((data) => {
      console.log("Updated sucessfully");
      this.refresh();
    }, error => {
      this.errorMessage = error;
     alert(this.errorMessage);
    });
      
  }
  deleteRowData(row_obj){
    this._productService.deleteProducts(row_obj.productId)
    .subscribe((data) => {
      console.log("Deleted succesfully");
      this.refresh();
    }, error => {
      this.errorMessage = error;
     alert(this.errorMessage);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
