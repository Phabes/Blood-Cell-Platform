import { Component } from "@angular/core";
import { GithubStudent } from "src/app/models/githubStudent";
import { Message } from "src/app/models/message";
import { Student } from "src/app/models/student";
import { MessagesService } from "src/app/services/messages.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-teacher-panel",
  templateUrl: "./teacher-panel.component.html",
  styleUrls: ["./teacher-panel.component.css"],
})
export class TeacherPanelComponent {
  students: Student[] = [];
  dates: string[] = [];
  showMessageWindow = false;
  messageTarget: Student[] = [];
  messageText = "";

  constructor(
    private userService: UserService,
    private messageService: MessagesService
  ) {}

  ngOnInit(): void {
    this.userService.getStudents().subscribe((students: Student[]) => {
      this.students = students;
      const commitsData: GithubStudent[] = students.map((student) => {
        const chunks = student.github.split("/");
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

  messageTextChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.messageText = input.value;
    console.log(this.messageText);
  }

  messageWindowState(state: boolean, messageTarget: Student[]): void {
    this.showMessageWindow = state;
    this.messageTarget = messageTarget;
  }

  sendMessage(): void {
    const message: Message = {
      date: new Date(),
      sender: "logged_teacher",
      text: this.messageText,
    };
    // if (Array.isArray(this.messageTarget))
    if (this.messageTarget.length == 1)
      this.messageService.sendMessageToOne(message, this.messageTarget[0]);
    else this.messageService.sendMessageToAll(message);
    this.messageWindowState(false, []);
  }
}
