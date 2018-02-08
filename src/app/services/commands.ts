import {File, Type} from '../entities';
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import * as _ from 'lodash';
import { CMDS, TAB_SPACE } from '../constants';
import {ActiveDirectoryService} from "./active-dir";

@Injectable()
export class CommandsService {
  private autocompleteCounter: number = 0;
  public autocompleteQuery: string = "";

  constructor(private http: HttpClient, private activeDir: ActiveDirectoryService){
  }

  help(){
    return [
      "Available commands:",
      " ",
      CMDS.DIR+"            List current directory contents.",
      CMDS.CD+" [target]    Change to target directory.",
      CMDS.TYPE+" [target]  View contents of target file.",
      CMDS.CLS+"            Clear the terminal.",
      " "
    ];
  }

  dir(currentDir: string){
    let list = ["Directory of "+currentDir," "];
    let data = this.activeDir.activeDirectory;

    let dirCount = _.sumBy(data, i => (i.type === Type.Directory ? 1 : 0));
    let fileCount = _.sumBy(data, i => (i.type === Type.File ? 1 : 0));
    for (let item of data) {
      list.push(this.parseContent(<File>item));
    }
    list.push(`${TAB_SPACE}${TAB_SPACE}${TAB_SPACE}${TAB_SPACE}${fileCount.toString()} File(s)`);
    list.push(`${TAB_SPACE}${TAB_SPACE}${TAB_SPACE}${TAB_SPACE}${dirCount.toString()} Dir(s)`);

    return list;
  }

  cd(targetDir: string) {
    let result: string = "";
      _.find(this.activeDir.activeDirectory, (v: File) => {
        if (v.type === Type.Directory && v.name.toLowerCase() === targetDir.toLowerCase()) {
          this.activeDir.activeDirectory = v.contents;
          result = v.name;
        }
      });
    return result;
  }

  root(){
    this.activeDir.activeDirectory = this.activeDir.drive;
  }

  autocomplete(query: string): string {
    if (!query){
      query = " ";
    }
    if (this.autocompleteQuery === ""){
      this.autocompleteQuery = query;
      this.autocompleteCounter = 0;
    }


    let reg = new RegExp(this.autocompleteQuery.split('').join('\\w*').replace(/\W/, ""), 'i');
    let data = this.activeDir.activeDirectory;
    let suggestions = [];

    data.filter((fileName)=>{
      if (fileName.name.match(reg)){
        suggestions.push(fileName.name + (fileName.extension ? fileName.extension : ""));
      }
    });

    let result = suggestions[this.autocompleteCounter];

    this.autocompleteCounter++;
    if (this.autocompleteCounter >= suggestions.length){
      this.autocompleteCounter = 0;
    }

    if (!result){
      result = "";
    }

    return result;
  }

  parseContent(file: File): string{
    let date = new Date();
    let line = `${date.getDate().toString().padStart(2,'0')}/${(date.getMonth()+1).toString().padStart(2,'0')}/${date.getFullYear()}${TAB_SPACE}08:00 AM${TAB_SPACE}`;
    let dir = file.type === Type.Directory ? `<DIR>` : "     ";

    line += dir + TAB_SPACE + file.name + (file.type === Type.Directory ? "" : file.extension);
    return line;
  }

  cat(fileName: string) {
    let file = _.find(this.activeDir.activeDirectory, (v: File) => {
      return (v.type === Type.File && v.name + v.extension === fileName);
    });
    if (file) {
      return file.contents;
    }
    else{
      return null;
    }
  }

  pong(){
    let file = _.find(this.activeDir.activeDirectory, (v: File) => {
      return (v.type === Type.File && v.name === "pong");
    });
    return file;
  }
}
