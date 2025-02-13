import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'project_ver_1';
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();
  sideBarOpen = true;
  constructor(private router: Router) {}

  

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
  showHeaderAndMenu(): boolean {
    // Check if the current route is not the login page
    return this.router.url !== '/login';
  }

}
