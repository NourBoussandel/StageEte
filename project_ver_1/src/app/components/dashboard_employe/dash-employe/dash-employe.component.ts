
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AdresseService } from 'src/app/services/adresse.service';
import { AuthService } from 'src/app/services/auth.service';
import { AdresseFormComponent } from '../../adresse-form/adresse-form.component';



@Component({
  selector: 'app-dash-employe',
  templateUrl: './dash-employe.component.html',
  styleUrls: ['./dash-employe.component.scss']
})
export class DashEmployeComponent implements OnInit {
  displayedColumns: string[] = ['lieu', 'region','ville','pays','code_postal','action'];
  coordonneesSelected: boolean = true;
  adressesSelected: boolean = false;
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();
  sideBarOpen = true;

  public  id_user: number=0;
  AdressDataSource!: MatTableDataSource<any>; 
   @ViewChild(MatPaginator) paginator!: MatPaginator;
   @ViewChild(MatSort) sort!: MatSort;
   public user: any = {}; 

   sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
 
  constructor(
     private router: Router,public dialog: MatDialog,
     private auth: AuthService,
      private adresseService : AdresseService
    ) { }


  ngOnInit() : void{ 
    this.id_user = this.auth.getUser().Id;
    this.getAllAddress(this.id_user);
  this.user= this.getUserInformations(this.id_user); 
  }

  onChipClick(chip: string) {
    this.coordonneesSelected = chip === 'CoordoneesSelected';
    this.adressesSelected = chip === 'AdressesSelected';
  }

//  pour afficher les adresses
openDialogAddress() {
  const dialogRef = this.dialog.open(AdresseFormComponent,{
    width:'30%',height:'80%',data:{id_user:this.id_user}
  }).afterClosed().subscribe(val=>{
    if(val=='enregistrer'){
      this.getAllAddress(this.id_user);
    }
  })
}
getAllAddress(id_user:number){
this.adresseService.getAdresse(id_user).subscribe({
next:(res)=>{
  console.log(res);
  this.AdressDataSource=new MatTableDataSource(res);
  this.AdressDataSource.paginator= this.paginator;
  this.AdressDataSource.sort=this.sort;

},
error:(err)=>{alert("erreur while getting adresses");}
})
}

  edit_adresse(row:any){
    this.dialog.open(AdresseFormComponent,{
      width:'30%',height:'80%',data:row
    }).afterClosed().subscribe({
      next:(res)=>{this.getAllAddress(this.id_user);
      }, 
      error:()=>{}
    }
  
        
    )
  }
  delete_adresse(id:number){
    this.adresseService.deleteAdresse(id).subscribe({
      next:(res)=>{
        alert("deleted success");
        this.getAllAddress(this.id_user);
      },
      error:()=>{
        alert("erreur suppression");
      }
    })
  
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.AdressDataSource.filter = filterValue.trim().toLowerCase();
  
    if (this.AdressDataSource.paginator) {
      this.AdressDataSource.paginator.firstPage();
    }
  }
 
 // pour afficher les coordonnées de l'utulisateur

getUserInformations(id_user:number){
  this.auth.getUserInformation(id_user).subscribe({
  next:(res)=>{
    this.user = res; 
    console.log(res);
    
  },
  error:(err)=>{alert("erreur while getting adresses");}
  })
  }
}