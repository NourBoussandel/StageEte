import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { DemandeService } from 'src/app/services/demande.service';
import { MatDatepicker} from '@angular/material/datepicker';
import{MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { AdresseService } from 'src/app/services/adresse.service';
import { Router } from '@angular/router';

interface JourFerier {
  num_jour: number; // You might have other properties as well
}
@Component({
  selector: 'app-demande-form',
  templateUrl: './demande-form.component.html',
  styleUrls: ['./demande-form.component.scss']
})
export class DemandeFormComponent {
  @ViewChild('pickerDebut') pickerDebut!: MatDatepicker<any>;
  @ViewChild('pickerFin') pickerFin!: MatDatepicker<any>;
  form_demande!: FormGroup;
  actionBtn:string ="enregistrer";
  jours_ferier: JourFerier[] = [];
  adresses_list: any []=[];
  acceptedDates: any[] = [];
  dataLoaded = false; // Ajoutez ceci dans votre classe
  


  constructor( private fb :FormBuilder, 
    private demandeService: DemandeService,
    private auth: AuthService,
    private router : Router,
    
    private dialogRef: MatDialogRef<DemandeFormComponent>,
    private adresseService : AdresseService,
    @Inject(MAT_DIALOG_DATA) public demande_to_update:any
    ){}
  ngOnInit(): void {
    

    this.form_demande= this.fb.group({
      date_debut:['', Validators.required],
      date_fin: ['', [Validators.required]],
      description:[''],
      id_demande: [0],
      id_contrat:[this.auth.getUser().id_contrat],
      id_adresse: [0]

    },
    { validators: this.dateRangeValidator }); 
    
    this.get_jours_ferier(this.auth.getUser().id_semaine);  
    this.getAcceptedDemands(this.auth.getUser().id_contrat);
    this.getAllAddress(this.auth.getUser().Id);

    if(this.demande_to_update.id_demande > 0){
      this.actionBtn="mettre a jour";
      this.form_demande.controls["date_debut"].setValue(this.demande_to_update.date_debut);
      this.form_demande.controls["date_fin"].setValue(this.demande_to_update.date_fin);
      this.form_demande.controls["description"].setValue(this.demande_to_update.description);
      this.form_demande.controls["id_demande"].setValue(this.demande_to_update.id_demande);
      this.form_demande.controls["id_contrat"].setValue(this.demande_to_update.id_contrat);
      this.form_demande.controls["id_adresse"].setValue(this.demande_to_update.id_adresse);


    }
    
    }
    dateToString(dateString: any) {
      if (dateString) {
        const date = new Date(dateString);
        return (
          date.getFullYear() +
          "-" +
          ("0" + (date.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + date.getDate()).slice(-2)
        );
      }
      return ""; // Retourner une chaîne vide si la date est undefined
    }

getAcceptedDemands(id_contrat: number) {
  this.demandeService.getAcceptedDemands(id_contrat).subscribe({
    next: (res) => {
      this.acceptedDates= res.map( (item: any) => ({

        date: this.dateToString(item)
      }));
      // Marquer les données comme chargées
      this.dataLoaded = true;
    },
    error: (err) => {
      alert('Erreur lors de la récupération des demandes');
    },
  });
}
 

    dateRangeValidator(control: FormGroup): { [key: string]: any } | null {
      const dateDebut = control.get('date_debut')?.value;
      const dateFin = control.get('date_fin')?.value;
    
      if (dateDebut && dateFin && dateDebut > dateFin) {
        control.get('date_fin')?.setErrors({ dateRangeInvalid: true });
        return { dateRangeInvalid: true };
      }
      
      
      
    
      return null;
    }
  

    save_demande(){
        if(this.form_demande.valid){
            this.demandeService.saveDemande(this.form_demande.value).subscribe(
              (message: string) => {
                console.log('demand saved successfully:', message);
                this.dialogRef.close('enregistrer');
              },
              (error) => {
                console.log('Error saving demand:', error);
              }
            )
          }
          else {this.validateAllFormFields(this.form_demande);
            ;
          }
      }
      private validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach((field) => {
          const control = formGroup.get(field);
          if (control instanceof FormGroup) {
            this.validateAllFormFields(control);
          } else {
            control?.markAsTouched();
          }
        });
      }
      
      get_jours_ferier(id_semaine:number){
        this.demandeService.GetJoursFerier(id_semaine).subscribe({
          next:(res)=>{
            this.jours_ferier=res;
        
          },
          error:(err)=>{alert(err);}
        })
      }
      myHolidayFilter = (d: Date | null): boolean => {
        if (!d) {
          return false;
        }
      
        // Disable past dates
        const today = new Date();
        if (d < today) {
          return false;
        }
        
        // Disable weekends
        const dayOfWeek = d.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          return false; // Weekend days are disabled
        }
      
        // Disable dates with specific num_jour values
        const selectedDayOfWeek = d.getDay(); // 0 (Sunday) to 6 (Saturday)
        const isDateInJoursFerier = this.jours_ferier.some(ferierDate => {
          return ferierDate.num_jour === selectedDayOfWeek;
        });
      
        const isDateInAcceptedDates = this.acceptedDates.some(acceptedDate => {
          const date = new Date(acceptedDate.date);
          return this.isSameDate(date, d); // Implement isSameDate as needed
        });
    
        return !isDateInJoursFerier && !isDateInAcceptedDates;
      };
      isSameDate(date1: Date, date2: Date): boolean {
        return (
          date1.getFullYear() === date2.getFullYear() &&
          date1.getMonth() === date2.getMonth() &&
          date1.getDate() === date2.getDate()
        );}


      getAllAddress(id_user:number){
        this.adresseService.getAdresse(id_user).subscribe({
        next:(res)=>{
          console.log(res);
          this.adresses_list = res;
  
        },
        error:(err)=>{alert("erreur while getting adresses");}
        })
        }
        annuler() {
          this.dialogRef.close('annuler');
        }

}
