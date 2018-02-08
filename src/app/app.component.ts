import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommandsService } from "./services/commands";
import { ActiveDirectoryService } from "./services/active-dir";
import {CMDS, TAB_SPACE, KEY, INVALID_KEYS} from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  @ViewChild('cmd') cmdLine: ElementRef;
  @ViewChild('email') email: ElementRef;
  @ViewChild('terminalWrapper') terminal: ElementRef;

  cmdHistory: string[] = [];
  currentType: string = "";
  currentDir: string = "C:\\";

  fixedWidth = 0.55;
  cmdWidth: number = 0;

  pongActive: boolean = false;

  constructor(private commands: CommandsService, private activeDir: ActiveDirectoryService) {
  }

  ngOnInit(){
    setTimeout(()=>{
    this.cmdLine.nativeElement.focus();
    this.activeDir.initRoot();
    },100);
  }

  focus(){
    this.cmdLine.nativeElement.focus();
  }

  scrollToBottom(){
    this.terminal.nativeElement.scrollTop = this.terminal.nativeElement.scrollHeight;
  }

  keyDown(e) {
    if(e.keyCode !== KEY.TAB) {
      this.commands.autocompleteQuery = "";
    }

    if (INVALID_KEYS.includes(e.keyCode)){
      return;
    }
    //todo swap to regex
    switch (e.keyCode){

      case KEY.TAB: // tab autocomplete
        e.preventDefault();
        let command;
            if (this.currentType.indexOf(CMDS.CD+" ") > -1) {
              command = CMDS.CD;
            }
            if (this.currentType.indexOf(CMDS.TYPE+" ") > -1) {
              command = CMDS.TYPE;
            }
            if (command && this.currentType.length >= command.length + 1) {
              let query = this.currentType.substr(this.currentType.indexOf(' ') + 1, this.currentType.length - command.length);
              let result = this.commands.autocomplete(query);
              this.currentType = command + " " + result;
              this.cmdWidth = (this.currentType.length * this.fixedWidth);
            }
      break;

      case KEY.RETURN:
        if (this.currentType===null) {
          this.currentType = "";
        }
        this.currentType = this.currentType.replace(/\s*$/,""); // Trim whitespace from end of string

        this.cmdHistory.push(this.currentDir+">"+this.currentType);

        if (this.currentType.length > 0) {
          let res = this.returnCommand(this.currentType);
          for (let item of res) {
            this.cmdHistory.push(item);
          }
          setTimeout(() => {
            this.scrollToBottom();
          }, 50);
        }
        this.currentType = null;
        this.cmdWidth=0;
        break;

      case KEY.BACKSPACE:
        if (this.cmdWidth >= this.fixedWidth) {
          this.cmdWidth = this.cmdWidth - this.fixedWidth;
        }
        break;

      default:
        this.cmdWidth=this.cmdWidth + this.fixedWidth;
        break;
    }
    // console.log(e.keyCode);
  }

  returnCommand(cmd): any {
    switch (cmd) {
      case CMDS.HELP:
        return this.commands.help();
      case CMDS.DIR:
        return this.commands.dir(this.currentDir);
      case CMDS.CLS:
        this.cmdHistory = [];
        return [];
    }

    if (cmd.substr(0,3) === CMDS.CD+" ") {
      let dir = cmd.substr(3, cmd.length);
         let res = this.commands.cd(dir);
         if (res) {
           this.currentDir += res;
           return ["\r\n"];
         }
         else {
           return ["The system cannot find the specified path.\r\n\r\n"];
         }
    }

    if (cmd === CMDS.CD+".." || cmd === CMDS.CD+"\\"){
      this.currentDir = "C:\\";
      this.commands.root();
      return ["\r\n"];
    }

    if (cmd.substr(0,5) === CMDS.TYPE+" ") {
      let file = cmd.substr(5, cmd.length);
      let result = this.commands.cat(file);
      if (result) {
        return result;
      }
      else{
        return ["The system cannot find the file specified.\r\n\r\n"];
      }
    }

    if (cmd==="ls" || cmd.substr(0,3) === "cat"){
      return ["No, this isn't Bash! Try again.\r\n\r\n"];
    }

    if (cmd==="pong"){
      if (this.commands.pong()){
        setTimeout(()=>{
        this.pongActive=true;
        },1000);
        return [" ", "Loading ....", " "];
      }
    }
    return ["Unrecognized command. Type 'help'..."];
  }

  onEmailClick(){
    let coded = "2SmM.i92I@Of2K0.kEf";
    let key = "pqLOVwaYKmS7QdbyNAkGJBlWr21ufHz4sIZ3UhDvo0tMXxgPFR8ienC69TjE5c";
    let shift = coded.length;
    let link = "";
    for (let i=0; i<coded.length; i++) {
      if (key.indexOf(coded.charAt(i)) === -1) {
        let ltr = coded.charAt(i);
        link += (ltr);
      }
      else {
        let ltr = (key.indexOf(coded.charAt(i))-shift+key.length) % key.length;
        link += (key.charAt(ltr));
      }
    }
    this.email.nativeElement.setAttribute("href", "mailto:"+link);
  }
}
