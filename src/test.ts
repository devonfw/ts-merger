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

  logout(test: string){
    return this.other1 + 'logout';
  }

  getCsrf(){
    return this.other1 + 'security/v1/csrftoken';
  }

  ngDoCheck(): string {
    if (this.language !== this.translate.currentLang) {
      this.language = this.translate.currentLang;
      this.columns = [
            {name: 'name', label: this.getTranslation('sampledatamanagementDataGrid.columns.name')},
          
            {name: 'surname', label: this.getTranslation('sampledatamanagementDataGrid.columns.surname')},
          
            {name: 'age', label: this.getTranslation('sampledatamanagementDataGrid.columns.age')},
          
            {name: 'mail', label: this.getTranslation('sampledatamanagementDataGrid.columns.mail')}
      ];
    }
    let patata = 2 + 2;
    for(let i = 0; i< 10; i++){
      console.log(i);
    }
    return "patata";
  }

  postSampleData(){
    return this.other1 + 'sampledatamanagement/v1/sampledata/';
  }

  postSampleDataSearch(){
    return this.other1 + 'sampledatamanagement/v1/sampledata/search';
  }

   getTranslation(text: string): string {
        let value: string;
        this.translate.get(text).subscribe( (res) => {
            value = res;
        });
        return value;
    }

    getData(): void {
       let me = this;
       this.dataGridService.getData(this.pageSize, this.currentPage, this.searchTerms, this.sorting)
                           .subscribe((res) => {
                               me.data = res.result;
                               me.dataTotal = res.pagination.total;
                           }, (error) =>{
                                this._dialogService.openConfirm({
                                    message: JSON.parse(error.text()).message,
                                    title: this.getTranslation('sampledatamanagementDataGrid.alert.title')
                                })
                           });
    }

  deleteSampleData(){
    return this.other1 + 'sampledatamanagement/v1/sampledata/';
  }

  
}

@decoratordeprueba()
export class patata{

}
