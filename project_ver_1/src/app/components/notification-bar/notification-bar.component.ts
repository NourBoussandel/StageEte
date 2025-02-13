import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.scss']
})
export class NotificationBarComponent implements  OnInit{
  id_user: number = 0;
  notifications: any[] = [];
  showNotifications: boolean = false;
  est_vue: boolean = false;


  constructor(private auth : AuthService){}

 ngOnInit(){
  this.id_user=this.auth.getUser().Id;
    
  this.get_all_notifications(this.id_user);
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

voirNotifications() {
  this.showNotifications = !this.showNotifications; // Toggle the flag
}



markNotificationAsSeen(notification:any): void {
  if (!notification.est_vue) {
    this.auth.MarkNotificationsAsSeen(notification).subscribe(
      () => {
        notification.est_vue = true;
      },
      (error) => {
        console.error('Error marking notification as seen:', error);
      }
    );
  }
}

}