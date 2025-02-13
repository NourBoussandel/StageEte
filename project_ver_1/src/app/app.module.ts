import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashEmployeComponent } from './components/dashboard_employe/dash-employe/dash-employe.component';
import { HttpClientModule } from '@angular/common/http';
import { NgToastModule } from 'ng-angular-popup';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListDemandeComponent } from './components/list-demande/list-demande.component';
import { NgConfirmModule } from 'ng-confirm-box';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import{MatInputModule} from'@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HeaderComponent } from './components/header/header.component';
import { DemandeFormComponent } from './components/demande-form/demande-form.component';

import {MatCardModule} from '@angular/material/card';
import { AdresseFormComponent } from './components/adresse-form/adresse-form.component';
import { MatSelectModule } from '@angular/material/select';
import { AccueilComponent } from './components/accueil_collab/accueil.component';
import { RaisonRefusComponent } from './components/raison-refus/raison-refus.component';

import {MatChipsModule} from '@angular/material/chips';
import { NotificationBarComponent } from './components/notification-bar/notification-bar.component';
import { AccueilManagerComponent } from './components/accueil-manager/accueil-manager.component';
import { HistoriqueDmdForManagerComponent } from './components/historique-dmd-for-manager/historique-dmd-for-manager.component';
import { GanttModule } from '@syncfusion/ej2-angular-gantt';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashEmployeComponent,
    ListDemandeComponent,
    DemandeFormComponent,
    SidenavComponent,
    HeaderComponent,
    DemandeFormComponent,
    AdresseFormComponent,
    AccueilComponent,
    RaisonRefusComponent,
    
    NotificationBarComponent,
         AccueilManagerComponent,
         HistoriqueDmdForManagerComponent,
    
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgToastModule,
    BrowserAnimationsModule,
    NgConfirmModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatDialogModule,
    MatSidenavModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatDividerModule,
    MatListModule,
    MatFormFieldModule,
     MatSelectModule,
     MatChipsModule,
     GanttModule
   
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
