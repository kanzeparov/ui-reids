import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/services';

@Component({
  selector: 'mpp-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.userService.fetchCurrentUser().subscribe();
  }

}
