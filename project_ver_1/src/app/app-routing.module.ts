import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashEmployeComponent } from './components/dashboard_employe/dash-employe/dash-employe.component';
import { ListDemandeComponent } from './components/list-demande/list-demande.component';
import { AuthGuard } from './guards/auth.guard';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HeaderComponent } from './components/header/header.component';
import { DemandeFormComponent } from './components/demande-form/demande-form.component';
import { AccueilComponent } from './components/accueil_collab/accueil.component';
import { NotificationBarComponent } from './components/notification-bar/notification-bar.component';
import { AccueilManagerComponent } from './components/accueil-manager/accueil-manager.component';
import { HistoriqueDmdForManagerComponent } from './components/historique-dmd-for-manager/historique-dmd-for-manager.component';



const routes: Routes = [
  {path:'login' , component:LoginComponent},
  {path:'accueil_collab' , component:AccueilComponent},
  {path:'dashboard_employe',component:DashEmployeComponent , canActivate:[AuthGuard]},
  {path:'list-demande',component:ListDemandeComponent,canActivate:[AuthGuard]},
  {path:'sidenav',component:SidenavComponent,canActivate:[AuthGuard]},
  {path:'header',component:HeaderComponent,canActivate:[AuthGuard]},
  {path:'demande-form',component:DemandeFormComponent,canActivate:[AuthGuard]},
  {path:'notification-bar',component:NotificationBarComponent},
  {path:'accueil_manager',component:AccueilManagerComponent},
  {path:'historique-dmd-for-manager',component:HistoriqueDmdForManagerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
