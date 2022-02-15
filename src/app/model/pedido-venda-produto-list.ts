import { Pedido } from './pedido';
export interface PedidoVendaProdutoList {

  pagina: number;
  total_de_paginas: number;
  registros: number;
  total_de_registros: number;
  pedido_venda_produto: Pedido[]

}
