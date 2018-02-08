// Contains the object of our current directory.
import {File} from '../entities';
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ActiveDirectoryService {

  public drive: File[];
  public activeDirectory: File[];


  constructor(private http: HttpClient){

  }

  async initRoot() {
    await this.http.get('assets/directory.json').toPromise().then((res) => {
      this.drive = <File[]>res;
      this.activeDirectory = this.drive;
    });
  }
}
