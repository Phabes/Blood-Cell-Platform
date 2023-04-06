import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivitiesService } from 'src/app/services/activities.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  messages!: Observable<{ date: Date; task: string; points: number }[]>;

  ngOnInit(): void {
    this.messages = this.activitiesService.getItems();
    this.activitiesService.getHeadersInfo();
  }
  constructor(private activitiesService: ActivitiesService) {}
}

// {
//   height: 4,
//   width: 8,
//   categories: [
//     [{
//       name: category1,
//       rowspan: 1,
//       colspan: 2
//     },
//     {
//       name: category2,
//       rowspan: 2,
//       colspan: 1
//     }],
//     [{
//       name: category3,
//       rowspan: 1,
//       colspan: 2
//     },
//     {
//       name: category4,
//       rowspan: 2,
//       colspan: 1
//     }]
//   ]
// }
