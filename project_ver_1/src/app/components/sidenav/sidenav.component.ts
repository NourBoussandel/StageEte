import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  isManager: boolean = false;
  constructor(
    private auth: AuthService,
   
   ) {}
   ngOnInit() {
    this.isManager = this.auth.getUser().role === 'manager';
  }
  
}
