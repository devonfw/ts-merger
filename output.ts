
> tsm@1.0.0 init D:\Users\rudiazma\Documents\bitBuckectRepos\tsm
> ts-node src/index.ts

import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import * as ts from 'typescript';
import { Patata } from 'patata/Rx';

@Injectable()
export class BusinessOperations {
@ViewChild('dataTable') dataTable;public serverPath = url;public servicesPath = this.serverPath;
  columns: any = [    {name: 'name', label: this.getTranslation('sampledatamanagementDataGrid.columns.name')},    {name: 'surname', label: this.getTranslation('sampledatamanagementDataGrid.columns.surname')},    {name: 'age', label: this.getTranslation('sampledatamanagementDataGrid.columns.age')},    {name: 'mail', label: this.getTranslation('sampledatamanagementDataGrid.columns.mail')},    {name: 'newField', label: this.getTranslation('sampledatamanagementDataGrid.columns.newField')}
  ];
data: any = [];selectedRow: any;other: number = 3;other1: string ="potato";other2: boolean = true;other3: [number, string] = [2, "numero2"];other5: number[] = [2, 3, 4, 5];
  item = {name: '',surname: '',age: '',mail: '',newField: ''
  };

  searchTerms: any = {name: null,surname: null,age: null,mail: null,newField: null
  };
@decorator()
  constructor() {
  }login(){
    return this.other1 + 'login';
  }logout(test: string){
    return this.other1 + 'logout';
  }getCsrf(){
    return this.other1 + 'security/v1/csrftoken';
  }ngDoCheck(): string {
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
  }postSampleData(){
    return this.other1 + 'sampledatamanagement/v1/sampledata/';
  }postSampleDataSearch(){
    return this.other1 + 'sampledatamanagement/v1/sampledata/search';
  }getTranslation(text: string): string {
        let value: string;
        this.translate.get(text).subscribe( (res) => {
            value = res;
        });
        return value;
    }

getData(size:numberpage: numbersearchTermssort: any[]){
let pageData = {pagination: {
          size: size,
          page: page,
          total: 1
        },name: searchTerms.name,surname: searchTerms.surname,age: searchTerms.age,mail: searchTerms.mail,sort: sort,newField: searchTerms.newField
};let pototao;let patata = 4 + 5;this.columns = this.getData();return this.http.post(this.BO.postSampleDataSearch(), pageData)
                      .map(res => res.json());
}

saveData(data){
let obj = {id: data.id,name: data.name,surname: data.surname,age: data.age,mail: data.mail,newField: data.newField
}return this.http.post(this.BO.postSampleData(),  obj )
                      .map(res => res.json());
}saveData(data) {
    let obj = {
      id: data.id,
      name: data.name,
      surname: data.surname,
      age: data.age,
      mail: data.mail
    };

      return this.http.post(this.BO.postSampleData(),  obj )
                      .map(res => res.json());
    }getData(): void {
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
    }deleteSampleData(){
    return this.other1 + 'sampledatamanagement/v1/sampledata/';
  }
}

@decoratordeprueba()
export class patata {

}
