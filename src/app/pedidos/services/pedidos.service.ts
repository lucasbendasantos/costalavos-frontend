import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, tap } from 'rxjs';

import { Pedido } from './../model/pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private readonly API = 'https://costalavos-api.herokuapp.com/costalavos/pedido'

  constructor(private httpClient: HttpClient) { }

  list() {
    return this.httpClient.get<Pedido[]>(this.API)
    .pipe(
      first(),
      tap(pedidos => console.log(pedidos))

    );

     // [{ codigoPedido: 2300644, dataPrevisao: '16/02/2021', nomeFantasia: 'Condominio Casa Bella', quantidadeItens: 2, valorTotalPedido: 500.00, endereco:'AV JOAO AMBIEL' }    ]
  }
}
