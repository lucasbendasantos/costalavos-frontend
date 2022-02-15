import { PedidoVendaProduto } from './../../model/pedido-venda-produto';
import { PedidoVendaProdutoList } from '../../model/pedido-venda-produto-list';
import { PedidoService } from './../../service/pedido.service';
import { Pedido } from './../../model/pedido';
import { MatDialog } from '@angular/material/dialog';
import { ElementDialogComponent } from './../../shared/element-dialog/element-dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';

declare var require: any;

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { PDFGeneratorComponent } from 'src/app/shared/pdfgenerator/pdfgenerator.component';
import { PageEvent } from '@angular/material/paginator';
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [PedidoService],
})
export class HomeComponent implements OnInit {
  @ViewChild(MatTable)
  table!: MatTable<any>;
  displayedColumns: string[] = [
    'pedido',
    'data',
    'cliente',
    'endereco',
    'itens',
    'total',
    'actions',
  ];
  dataSource!: any[];
  element: any = {};
  firstElement: any = {};

  length = 100;
  pageSize = 10;
  paginacao: any = { pagina: 0, registros: this.pageSize };
  pageSizeOptions: number[] = [5, 10, 15, 20];
  pageEvent!: PageEvent;

  mostrar = false;

  pdfGenerator!: PDFGeneratorComponent;

  numeroPedidoDe: string = '';
  numeroPedidoAte: string = '';
  nomeFantasiaCliente: string = '';
  numeroPedidoErroState = false;
  numeroPedidoErroMsg!: string;

  constructor(public dialog: MatDialog, public pedidoService: PedidoService) {
    this.pedidoService
      .listAllPage(this.paginacao.pagina, this.paginacao.registros, '', '', '')
      .subscribe((data: PedidoVendaProdutoList) => {
        this.dataSource = data.pedido_venda_produto;
        this.firstElement = data.pedido_venda_produto[0];
        this.paginacao = {
          pagina: data.pagina - 1,
          registros: data.registros,
          total_de_paginas: data.total_de_paginas,
          total_de_registros: data.total_de_registros,
        };
        console.log(this.paginacao);
        this.length = this.paginacao.total_de_registros;
        this.pageSize = this.paginacao.registros;
        this.mostrar = true;
      });
  }

  ngOnInit(): void {}

  openDialog(element: Pedido | null): void {
    const dialogRef = this.dialog.open(ElementDialogComponent, {
      width: '100%',
      data:
        element === null
          ? {
              position: null,
              name: '',
              weight: null,
              symbol: '',
            }
          : element,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.dataSource.push(result);
        this.table.renderRows();
      }
    });
  }

  viewPDF(numeroPedido: number): void {
    this.pedidoService
      .getPedido(+numeroPedido)
      .subscribe((data: PedidoVendaProduto) => {
        console.log('DENTRO DO getPEDIDOS');
        console.log(data);
        this.element = data;
        this.openDialog2(data);
      });
  }

  openDialog2(element: PedidoVendaProduto): void {
    console.log('FORA DO GETPEDIDOS');
    console.log(element);

    const dialogRef = this.dialog.open(ElementDialogComponent, {
      width: '100%',
      data: element,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.dataSource.push(result);
        this.table.renderRows();
      }
    });
  }

  public async downloadAsPDF(element: PedidoVendaProduto) {
    this.firstElement = element;

    console.log('DELAY 15 Segundos');
    await this.delay(1500);

    this.pdfGenerator = new PDFGeneratorComponent();
    this.pdfGenerator.buildPDF(this.firstElement);
  }

  private delay(ms: number): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, ms);
    });
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput
        .split(',')
        .map((str) => +str);
    }
  }

  pageNavigations(event: PageEvent) {

      if (this.numeroPedidoDe.length !== 0 && this.numeroPedidoAte.length !== 0) {
        if (parseInt(this.numeroPedidoDe) > parseInt(this.numeroPedidoAte)) {
            this.numeroPedidoErroState = true;
            this.numeroPedidoErroMsg = "Número pedido DE precisa ser MAIOR que ATE"
        }
      }

    this.mostrar = false;
    console.log(event);

    this.paginacao.pagina = event.pageIndex + 1;
    this.pedidoService
      .listAllPage(this.paginacao.pagina, event.pageSize, this.numeroPedidoDe, this.numeroPedidoAte, this.nomeFantasiaCliente)
      .subscribe((data: PedidoVendaProdutoList) => {
        this.dataSource = data.pedido_venda_produto;
        this.firstElement = data.pedido_venda_produto[0];

        this.paginacao = {
          pagina: data.pagina - 1,
          registros: event.pageSize,
          total_de_paginas: data.total_de_paginas,
          total_de_registros: data.total_de_registros,
        };
        console.log(this.paginacao);

        this.length = this.paginacao.total_de_registros;
        this.pageSize = this.paginacao.registros;
        this.mostrar = true;
      });
  }

  filterList() {
    if (this.numeroPedidoDe.length !== 0 && this.numeroPedidoAte.length !== 0) {
      if (parseInt(this.numeroPedidoDe) > parseInt(this.numeroPedidoAte)) {
          this.numeroPedidoErroState = true;
          this.numeroPedidoErroMsg = "Número pedido DE precisa ser MAIOR que ATE"
      }
    }


    this.mostrar = false;
    this.pedidoService
      .listAllPage(this.paginacao.pagina, 10, this.numeroPedidoDe, this.numeroPedidoAte, this.nomeFantasiaCliente)
      .subscribe((data: PedidoVendaProdutoList) => {
        this.dataSource = data.pedido_venda_produto;
        this.firstElement = data.pedido_venda_produto[0];
        if(this.nomeFantasiaCliente !== ''){
          this.nomeFantasiaCliente = this.firstElement.cliente.nome_fantasia
        }
        this.paginacao = {
          pagina: data.pagina - 1,
          registros: data.registros,
          total_de_paginas: data.total_de_paginas,
          total_de_registros: data.total_de_registros,
        };
        console.log(this.paginacao);

        this.length = this.paginacao.total_de_registros;
        this.pageSize = this.paginacao.registros;
        this.mostrar = true;
      });


  }
}
