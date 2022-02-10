import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PedidoVendaProduto } from './../../model/pedido-venda-produto';
import { Component, OnInit, ViewChild, ElementRef, Inject, Input } from '@angular/core';

declare var require: any;

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { Pedido } from 'src/app/model/pedido';
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-pdfgenerator',
  templateUrl: './pdfgenerator.component.html',
  styleUrls: ['./pdfgenerator.component.scss']
})
export class PDFGeneratorComponent implements OnInit {

  @ViewChild('tabela')
  pdfTable!: ElementRef;

  @Input()
  element!: any
  listaProdutos!: any;

  @Input()
  public _reload: boolean =  true;

  public mostrar: boolean = false;

  constructor() {

  }

  ngOnInit(): void {
  }

  public buildPDF(element: PedidoVendaProduto) {

    this.mostrar = true
    this.element = element;
    this.reload();
    console.log("FIRST ELEMENT")
    console.log(this.element)

   // console.log(this.pdfTable.nativeElement)
    this.reload();
    //const pdfTable = this.pdfTable.nativeElement;
    const pdfTable = document.getElementById("tabela");
    var html = htmlToPdfmake(document.getElementById('tabela')!.innerHTML);
    this.reload();
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).download();


  }

  private reload() {
    setTimeout(() => this._reload = false);
    setTimeout(() => this._reload = true);
}

}
