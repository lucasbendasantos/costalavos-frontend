import { Cabecalho } from './cabecalho';
import { Cliente } from './cliente';
import { Det } from './det';
import { Frete } from './frete';
import { TotalPedido } from './total-pedido';

export interface Pedido {

  cabecalho: Cabecalho,
  total_pedido: TotalPedido,
  det: Det,
  frete: Frete,
  cliente: Cliente

}
