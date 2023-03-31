import { Component } from '@angular/core';
import { Message } from 'src/app/models/message';
import { Student } from 'src/app/models/student';
import { MessagesService } from 'src/app/services/messages.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-teacher-panel',
  templateUrl: './teacher-panel.component.html',
  styleUrls: ['./teacher-panel.component.css'],
})
export class TeacherPanelComponent {
  students: Student[] = [];
  dates: string[] = [];
  showMessageWindow: boolean = false;
  messageTarget: Student[] | Student = [];
  messageText: string = '';

  constructor(
    private userService: UserService,
    private messageService: MessagesService
  ) {}

  ngOnInit(): void {
    this.userService.getStudents().subscribe((students: Student[]) => {
      this.students = students;
      const commitsData = students.map((student) => {
        const chunks = student.github.split('/');
        const length = chunks.length,
          owner = chunks[length - 2],
          repo = chunks[length - 1];
        return { owner, repo };
      });
      this.userService
        .getStudentsLastCommitDates(commitsData)
        .subscribe((dates: string[]) => {
          this.dates = dates;
        });
    });
  }

  messageTextChange(e: any): void {
    this.messageText = e.target.value;
  }

  messageWindowState(state: boolean, messageTarget: Student[] | Student): void {
    this.showMessageWindow = state;
    this.messageTarget = messageTarget;
  }

  sendMessage(): void {
    const message: Message = {
      date: new Date(),
      sender: 'logged_teacher',
      text: this.messageText,
    };
    if (Array.isArray(this.messageTarget))
      this.messageService.sendMessageToAll(message);
    else this.messageService.sendMessageToOne(message, this.messageTarget);
    this.messageWindowState(false, []);
  }
}
