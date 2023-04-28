import { Component } from "@angular/core";
import { Message } from "src/app/models/message";
import { MessagesService } from "src/app/services/messages.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.css"],
})
export class MessagesComponent {
  messages: Message[] = [];

  constructor(
    private userService: UserService,
    private messageService: MessagesService
  ) {}

  ngOnInit(): void {
    this.messageService
      .getStudentMessages(this.userService.getUserID())
      .subscribe((data) => {
        // if(data.action=="MESSAGES_RETRIEVED"){

        // }
        console.log(data);
        this.messages = data;
      });
  }
}
