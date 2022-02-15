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

  listAllPage(pagina: number, registros_por_pagina: number, numeroPedidoDe: string, numeroPedidoAte: string, nomeFantasia: string): Observable<PedidoVendaProdutoList>{

    var body = {"pagina":pagina,"registros_por_pagina":registros_por_pagina,"apenas_importado_api":"N", "numero_pedido_de": numeroPedidoDe, "numero_pedido_ate": numeroPedidoAte, "nome_fantasia": nomeFantasia }
    console.log(body)
    return this.http.post<PedidoVendaProdutoList>(this.apiUrl, body);
  }
}
