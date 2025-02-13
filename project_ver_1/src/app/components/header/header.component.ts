import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();
  public fullName : string = "";
  notifications: any[] = [];
  id_user: number = 0;
  hasNewNotification: boolean = false;
  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.fullName= this.auth.getUser()?.unique_name ?? "";
    this.id_user=this.auth.getUser().Id;
    
  this.get_all_notifications(this.id_user);
  this.checkForNewNotifications();
  }
  checkForNewNotifications() {
    
    this.auth.hasNewNotifications().subscribe((hasNew) => {
      this.hasNewNotification = hasNew; 
    });
  }
 
  get_all_notifications(id_user: number) {
    this.auth.getNotifications(id_user).subscribe({
      next: (res) => {
        console.log(res);
      this.notifications=res;
      },
      error: (err) => {
        alert(err);
      }
    });
  }
  markNotificationAsSeen(notification: any) {
    if (!notification.est_vue) {
      this.auth.MarkNotificationsAsSeen(notification).subscribe(
        () => {
          notification.est_vue = true;
          this.checkForNewNotifications();
        },
        (error) => {
          console.error('Failed to mark notification as seen:', error);
        }
      );
    }

  }

  toggleSidebar() {

    this.toggleSidebarForMe.emit();
  }
  logout(){
    this.auth.signOut();
  }


}
