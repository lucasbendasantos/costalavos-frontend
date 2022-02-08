import { PedidoVendaProduto } from './../model/pedido-venda-produto';
import { PedidoVendaProdutoList } from '../model/pedido-venda-produto-list';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  apiUrl = 'https://costalavos-api.herokuapp.com/costalavos/pedido'
  constructor(private http: HttpClient) { }

  listAll(): Observable<PedidoVendaProdutoList>{
    var body = {"pagina":1,"registros_por_pagina":14,"apenas_importado_api":"N"}
    return this.http.post<PedidoVendaProdutoList>(this.apiUrl, body);
  }

  getPedido(numeroPedido: number): Observable<PedidoVendaProduto>{
    return this.http.get<PedidoVendaProduto>(`${this.apiUrl}?numero_pedido=${numeroPedido}`);
  }
}
