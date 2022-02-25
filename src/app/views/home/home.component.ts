import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import * as moment from 'moment';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { PDFGeneratorComponent } from 'src/app/shared/pdfgenerator/pdfgenerator.component';

import { PedidoVendaProdutoList } from '../../model/pedido-venda-produto-list';
import { Pedido } from './../../model/pedido';
import { PedidoVendaProduto } from './../../model/pedido-venda-produto';
import { PedidoService } from './../../service/pedido.service';
import { ElementDialogComponent } from './../../shared/element-dialog/element-dialog.component';

declare var require: any;

const htmlToPdfmake = require('html-to-pdfmake');
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [
    PedidoService,
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class HomeComponent implements OnInit {
  @ViewChild(MatTable)
  table!: MatTable<any>;
  displayedColumns: string[] = [
    'checkbox',
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
  pageSize = 5;
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
  dataDe: any = '';
  dataAte: any = '';

  allComplete: boolean = false;

  checkBoxs: boolean = false;

  listaParaDownload: any[] = [];

  daterange!: FormGroup;

  elementoVisualizado: any;

  constructor(public dialog: MatDialog, public pedidoService: PedidoService) {
    this.pedidoService
      .listAllPage(
        this.paginacao.pagina,
        this.paginacao.registros,
        this.numeroPedidoDe,
        this.numeroPedidoAte,
        this.nomeFantasiaCliente,
        this.dataDe,
        this.dataAte
      )
      .subscribe((data: PedidoVendaProdutoList) => {
        this.dataSource = data.pedido_venda_produto;
        this.firstElement = data.pedido_venda_produto[0];
        this.setCheckBoxsStatus(this.dataSource);
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

  ngOnInit(): void {
    this.daterange = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    });
  }

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
    if (this.elementoVisualizado !== undefined) {
      if (parseInt(this.elementoVisualizado.pedido_venda_produto.cabecalho
        .numero_pedido) == parseInt(numeroPedido+"")) {
        this.openDialog2(this.elementoVisualizado);
      }else{
        this.mostrar = false;
        this.pedidoService
        .getPedido(+numeroPedido)
        .subscribe((data: PedidoVendaProduto) => {
          this.element = data;
          this.elementoVisualizado = data;
          this.openDialog2(data);
          this.mostrar = true;
        });
      }
    } else {
      this.mostrar = false;
      this.pedidoService
        .getPedido(+numeroPedido)
        .subscribe((data: PedidoVendaProduto) => {
          console.log(data);
          this.element = data;
          this.elementoVisualizado = data;
          this.openDialog2(data);
          this.mostrar = true;
        });
    }
  }

  openDialog2(element: PedidoVendaProduto): void {


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
        this.numeroPedidoErroMsg = 'Número pedido DE precisa ser MAIOR que ATE';
      }
    }

    this.mostrar = false;
    console.log(event);

    this.paginacao.pagina = event.pageIndex + 1;
    this.pedidoService
      .listAllPage(
        this.paginacao.pagina,
        event.pageSize,
        this.numeroPedidoDe,
        this.numeroPedidoAte,
        this.nomeFantasiaCliente,
        this.dataDe,
        this.dataAte
      )
      .subscribe((data: PedidoVendaProdutoList) => {
        this.dataSource = data.pedido_venda_produto;
        this.firstElement = data.pedido_venda_produto[0];
        this.setCheckBoxsStatus(this.dataSource);

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
    let dataDe: moment.Moment = moment.utc(this.daterange.value.start);
    let dataFormatadaDe = dataDe.format('DD/MM/YYYY');

    let dataAte: moment.Moment = moment.utc(this.daterange.value.end);
    let dataFormatadaAte = dataAte.format('DD/MM/YYYY');

    if (
      dataFormatadaDe == 'Invalid date' ||
      dataFormatadaAte == 'Invalid date'
    ) {
      dataFormatadaDe = '';
      dataFormatadaAte = '';
      this.dataDe = '';
      this.dataAte = '';
    }

    this.dataDe = dataFormatadaDe;
    this.dataAte = dataFormatadaAte;

    if (this.numeroPedidoDe.length !== 0 && this.numeroPedidoAte.length !== 0) {
      if (parseInt(this.numeroPedidoDe) > parseInt(this.numeroPedidoAte)) {
        this.numeroPedidoErroState = true;
        this.numeroPedidoErroMsg = 'Número pedido DE precisa ser MAIOR que ATE';
      }
    }

    this.mostrar = false;
    this.pedidoService
      .listAllPage(
        this.paginacao.pagina,
        this.paginacao.registros,
        this.numeroPedidoDe,
        this.numeroPedidoAte,
        this.nomeFantasiaCliente,
        this.dataDe,
        this.dataAte
      )
      .subscribe((data: PedidoVendaProdutoList) => {
        this.dataSource = data.pedido_venda_produto;
        this.firstElement = data.pedido_venda_produto[0];
        this.setCheckBoxsStatus(this.dataSource);
        if (this.nomeFantasiaCliente !== '') {
          this.nomeFantasiaCliente = this.firstElement.cliente.nome_fantasia;
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

  montaListaParaDownload(elemento: any) {
    this.allComplete = false;
    console.log(this.listaParaDownload);
    if (this.listaParaDownload.length !== 0) {
      for (var i = 0; i < this.listaParaDownload.length; i++) {
        var elementoNalista = this.listaParaDownload[i];

        if (
          elemento.cabecalho.numero_pedido ===
          elementoNalista.cabecalho.numero_pedido
        ) {
          this.listaParaDownload.splice(i, 1);
          console.log(this.listaParaDownload);
          return;
        }
      }
    }

    this.listaParaDownload.push(elemento);
    console.log(this.listaParaDownload);
  }

  public async downloadAllPDFs() {
    for (var i = 0; i < this.listaParaDownload.length; i++) {
      await this.delay(1000);
      this.downloadAsPDF(this.listaParaDownload[i]);
      await this.delay(1000);
    }
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    this.checkBoxs = completed;

    for (var i = 0; i < this.dataSource.length; i++) {
      this.dataSource[i].checked = completed;
      this.montaListaParaDownload(this.dataSource[i]);
    }
  }

  setCheckBoxsStatus(dataSource: any) {
    for (var i = 0; i < dataSource.lengh; i++) {
      dataSource[i].checked = false;
    }
    this.dataSource = dataSource;
  }
}
