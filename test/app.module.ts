import {
    BusinessOperations
} from './BusinessOperations';
import {
    SampledatamanagementAddDialogComponent
} from './components/sampledatamanagementAddDialog/sampledatamanagementAddDialog.component';
import {
    TranslateModule,
    TranslateLoader,
    TranslateStaticLoader
} from 'ng2-translate/ng2-translate';
import {
    HttpModule,
    Http
} from '@angular/http';
import {
    NgModule
} from '@angular/core';
import {
    BrowserModule
} from '@angular/platform-browser';
import {
    MaterialModule
} from '@angular/material';
import {
    Material2AppAppComponent
} from './app.component';
import {
    routing
} from './app.routing';
import {
    FormsModule
} from '@angular/forms';
import 'hammerjs';
import {
    CovalentCoreModule
} from '@covalent/core';
import {
    HeaderComponent
} from './components/header/header.component';
import {
    LoginComponent
} from './components/login/login.component';
import {
    HomeComponent
} from './components/home/home.component';
import {
    SampledatamanagementDataGridComponent
} from './components/sampledatamanagementDataGrid/sampledatamanagementDataGrid.component';
import {
    SampledatamanagementDataGridService
} from './components/sampledatamanagementDataGrid/sampledatamanagementDataGrid.service';
import {
    SecurityService
} from './security/security.service';
import {
    HttpClient
} from './security/httpClient.service';
import {
    MoredatamanagementAddDialogComponent
} from './components/moredatamanagementAddDialog/moredatamanagementAddDialog.component';
import {
    MoredatamanagementDataGridComponent
} from './components/moredatamanagementDataGrid/moredatamanagementDataGrid.component';
import {
    MoredatamanagementDataGridService
} from './components/moredatamanagementDataGrid/moredatamanagementDataGrid.service';
export function translateFactory(http: Http) {
    return new TranslateStaticLoader(http, '/assets/i18n', '.json');
}
@NgModule({
    imports: [BrowserModule, CovalentCoreModule.forRoot(), FormsModule, HttpModule, routing, MaterialModule.forRoot(), TranslateModule.forRoot({
        provide: TranslateLoader,
        useFactory: translateFactory,
        deps: [Http]
    }), ],
    declarations: [Material2AppAppComponent, HeaderComponent, LoginComponent, HomeComponent, SampledatamanagementDataGridComponent, SampledatamanagementAddDialogComponent, MoredatamanagementDataGridComponent, MoredatamanagementAddDialogComponent, ],
    entryComponents: [SampledatamanagementAddDialogComponent, MoredatamanagementAddDialogComponent, ],
    bootstrap: [Material2AppAppComponent, ],
    providers: [SampledatamanagementDataGridService, SecurityService, HttpClient, BusinessOperations, MoredatamanagementDataGridService, ],
}) export class AppModule {}