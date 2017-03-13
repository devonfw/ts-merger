import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import * as ts from 'typescript';

@Injectable()
export class BusinessOperations {

  @ViewChild('dataTable') dataTable;
  public serverPath = url;
  public servicesPath = this.serverPath;

  columns: any = [
    {name: 'name', label: this.getTranslation('sampledatamanagementDataGrid.columns.name')},
    {name: 'surname', label: this.getTranslation('sampledatamanagementDataGrid.columns.surname')},
    {name: 'age', label: this.getTranslation('sampledatamanagementDataGrid.columns.age')},
    {name: 'mail', label: this.getTranslation('sampledatamanagementDataGrid.columns.mail')}
  ];  

  data: any = [];
  selectedRow: any;
  other: number = 3;
  other1: string ="potato";
  other2: boolean = true;
  other3: [number, string] = [2, "numero2"];
  other5: number[] = [2, 3, 4, 5];

  item = {
    name: '',
    surname: '',
    age: '',
    mail: ''
  };

  searchTerms: any = {
    name: null,
    surname: null,
    age: null,
    mail: null
  };

  @decorator()
  constructor() {
  }

  login(){
    return this.other1 + 'login';
  }

  logout(){
    return this.other1 + 'logout';
  }

  getCsrf(){
    return this.other1 + 'security/v1/csrftoken';
  }

  postSampleData(){
    return this.other1 + 'sampledatamanagement/v1/sampledata/';
  }

  postSampleDataSearch(){
    return this.other1 + 'sampledatamanagement/v1/sampledata/search';
  }

  deleteSampleData(int: number, text: string, is: boolean){
    return this.other1 + 'sampledatamanagement/v1/sampledata/';
  }

}

@decoratordeprueba()
export class patata{

}
