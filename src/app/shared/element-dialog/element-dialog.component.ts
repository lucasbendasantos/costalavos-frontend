import { Produto } from './../../model/produto';
import { PedidoVendaProduto } from './../../model/pedido-venda-produto';
import { Pedido } from './../../model/pedido';
import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-element-dialog',
  templateUrl: './element-dialog.component.html',
  styleUrls: ['./element-dialog.component.scss']
})
export class ElementDialogComponent implements OnInit {

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

}
