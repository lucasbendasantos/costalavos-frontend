import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AppMaterialModule } from './../shared/app-material/app-material.module';
import { PedidosRoutingModule } from './pedidos-routing.module';
import { PedidosComponent } from './pedidos/pedidos.component';



@NgModule({
  declarations: [
    PedidosComponent
  ],
  imports: [
    CommonModule,
    PedidosRoutingModule,
    AppMaterialModule,
    SharedModule
  ]
})
export class PedidosModule { }
