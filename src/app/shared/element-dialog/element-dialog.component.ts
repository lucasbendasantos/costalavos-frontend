import { Produto } from './../../model/produto';
import { PedidoVendaProduto } from './../../model/pedido-venda-produto';
import { Pedido } from './../../model/pedido';
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

declare var require: any;

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-element-dialog',
  templateUrl: './element-dialog.component.html',
  styleUrls: ['./element-dialog.component.scss']
})
export class ElementDialogComponent implements OnInit {

  @ViewChild('pdfTable')
  pdfTable!: ElementRef;

  element!: PedidoVendaProduto
  listaProdutos!: any;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: PedidoVendaProduto,
    public dialogRef: MatDialogRef<Pedido>,
  ) {}

  ngOnInit(): void {
    this.getProdutos()
    console.log("dentro do dialog")
    console.log(this.data.pedido_venda_produto.cabecalho.codigo_pedido)
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getProdutos(){
    this.listaProdutos = [];
    this.listaProdutos = this.data.pedido_venda_produto.det;
    console.log("Lista Produto")
    console.log(this.data.pedido_venda_produto.det)

  }

  public downloadAsPDF() {
    const pdfTable = this.pdfTable.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).download(`${this.data.pedido_venda_produto.cabecalho.numero_pedido}`);

  }







}
