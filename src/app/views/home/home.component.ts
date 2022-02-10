import { Cabecalho } from './../../model/cabecalho';
import { PedidoVendaProduto } from './../../model/pedido-venda-produto';
import { PedidoVendaProdutoList } from '../../model/pedido-venda-produto-list';
import { PedidoService } from './../../service/pedido.service';
import { Pedido } from './../../model/pedido';
import { MatDialog } from '@angular/material/dialog';
import { ElementDialogComponent } from './../../shared/element-dialog/element-dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { delay } from 'rxjs';

declare var require: any;

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

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

  viewPDF(numeroPedido: number): void{

    this.pedidoService.getPedido(+numeroPedido)
      .subscribe((data: PedidoVendaProduto) => {
        console.log("DENTRO DO getPEDIDOS")
        console.log(data)
        this.element = data;
        this.openDialog2(data);
      })
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


  public downloadAsPDF(element: any) {

    console.log(element);
    var html = htmlToPdfmake('pdfTeste');
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).download();
  }

}
