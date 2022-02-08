import { PedidoVendaProduto } from './../../model/pedido-venda-produto';
import { PedidoVendaProdutoList } from '../../model/pedido-venda-produto-list';
import { PedidoService } from './../../service/pedido.service';
import { Pedido } from './../../model/pedido';
import { MatDialog } from '@angular/material/dialog';
import { ElementDialogComponent } from './../../shared/element-dialog/element-dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { delay } from 'rxjs';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [PedidoService]
})
export class HomeComponent implements OnInit {

  @ViewChild(MatTable)
  table!: MatTable<any>;
  displayedColumns: string[] = ['pedido', 'data', 'cliente', 'endereco', 'itens', 'total', 'actions'];
  dataSource!: any[];
  element: any = {};

  constructor(
    public dialog: MatDialog,
    public pedidoService: PedidoService
    ) {

        this.pedidoService.listAll()
          .subscribe((data: PedidoVendaProdutoList) => {
            this.dataSource = data.pedido_venda_produto;

          })

    }

  ngOnInit(): void {
  }

  openDialog(element: Pedido | null): void{

    const dialogRef = this.dialog.open(ElementDialogComponent, {
      width: '100%',
      data: element === null ? {
        position: null,
        name: '',
        weight: null,
        symbol: ''
      } : element
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined){
        this.dataSource.push(result);
        this.table.renderRows();
      }
    });
  }

  buildPDF(position: number): void{

  }

  viewPDF(codigoPedido: number): void{

    this.pedidoService.getPedido(codigoPedido)
      .subscribe((data: PedidoVendaProduto) => {
        console.log("DENTRO DO getPEDIDOS")
        console.log(data)
        this.element = data;
        this.openDialog2(data);
      })



/**    console.log("FORA DO GETPEDIDOS")
    console.log(this.element)

    const dialogRef = this.dialog.open(ElementDialogComponent, {
      width: '100%',
      data: this.element
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined){
        this.dataSource.push(result);
        this.table.renderRows();
      }
    });
 */
  }


  openDialog2(element: PedidoVendaProduto): void{
    console.log("FORA DO GETPEDIDOS")
    console.log(element)

    const dialogRef = this.dialog.open(ElementDialogComponent, {
      width: '100%',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined){
        this.dataSource.push(result);
        this.table.renderRows();
      }
    });

  }

}
