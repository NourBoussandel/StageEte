import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-raison-refus',
  templateUrl: './raison-refus.component.html',
  styleUrls: ['./raison-refus.component.scss']
})
export class RaisonRefusComponent {
  public raisons_refus: any;

  constructor(public dialogRef: MatDialogRef<RaisonRefusComponent>,
    private router : Router,
    ){}

  valider_refus(){
    this.dialogRef.close(this.raisons_refus);
  }
  annuler() {
    this.dialogRef.close();
  }
}
