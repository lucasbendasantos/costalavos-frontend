import { Pedido } from './../../model/pedido';
import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-element-dialog',
  templateUrl: './element-dialog.component.html',
  styleUrls: ['./element-dialog.component.scss']
})
export class ElementDialogComponent implements OnInit {

  element!: Pedido

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: Pedido,
    public dialogRef: MatDialogRef<Pedido>,
  ) {}

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
