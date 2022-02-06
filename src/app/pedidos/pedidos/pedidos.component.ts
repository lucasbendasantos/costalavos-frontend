import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, Observable, of } from 'rxjs';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';

import { Pedido } from '../model/pedido';
import { PedidosService } from './../services/pedidos.service';


@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})

export class PedidosComponent implements OnInit {

  pedidos$: Observable<Pedido[]>;

  displayedColumns = ['codigoPedido', 'nomeFantasia', 'dataPrevisao', 'quantidadeItens', 'valorTotalPedido'];


  constructor(
    private pedidosService:PedidosService,
    public dialog: MatDialog
    ) {

    this.pedidos$ = this.pedidosService.list()
    .pipe(
      catchError(error => {
        this.onError('Erro ao carregar pedidos');
        return of([])
      })
    );
  }


  onError(errorMSg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMSg
    });
  }


  ngOnInit(): void {
  }

}
