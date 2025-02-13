import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdresseService } from 'src/app/services/adresse.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-adresse-form',
  templateUrl: './adresse-form.component.html',
  styleUrls: ['./adresse-form.component.scss']
})
export class AdresseFormComponent {
  form_adresse!: FormGroup;
  actionBtn:string ="enregistrer"
  

  constructor( private fb :FormBuilder, 
    private adresseService: AdresseService,
    private auth : AuthService,
    private dialogRef: MatDialogRef<AdresseFormComponent>,
    @Inject(MAT_DIALOG_DATA) public adresse_to_update:any
    ){}


    ngOnInit(): void {
      this.form_adresse= this.fb.group({
        lieu:[''],
         region:[''],
        ville:[''],
        pays: [''],
        code_postal:[''],
        id_adresse:[0],
        id_user:[this.auth.getUser().Id]
        
      }); 
  
      if(this.adresse_to_update.id_adresse > 0){
        this.actionBtn="mettre a jour";
        this.form_adresse.controls["lieu"].setValue(this.adresse_to_update.lieu);
        this.form_adresse.controls["region"].setValue(this.adresse_to_update.region);
        this.form_adresse.controls["ville"].setValue(this.adresse_to_update.ville);
        this.form_adresse.controls["pays"].setValue(this.adresse_to_update.pays);
        this.form_adresse.controls["code_postal"].setValue(this.adresse_to_update.code_postal);
        this.form_adresse.controls["id_user"].setValue(this.adresse_to_update.id_user);
        this.form_adresse.controls["id_adresse"].setValue(this.adresse_to_update.id_adresse);


  
      }
      
      }
    
  save_adresse(){

    if(this.form_adresse.valid){
      
      
        this.adresseService.saveAdresse(this.form_adresse.value).subscribe(
          (message: string) => {
            console.log('adresse saved successfully:', message);
            this.dialogRef.close('enregistrer');
          },
          (error) => {
            console.log('Error saving demand:', error);
          }
        )
      }
      
  }
  annuler() {
    this.dialogRef.close('annuler');
  }


}
