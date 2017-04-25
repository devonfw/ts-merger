import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { MoreDataDataGridComponent } from 'donde sea coño';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'moredatamanagementdataGrid', component: MoredatamanagementDataGridComponent },
    { path: '**', redirectTo: 'home' }
]

export const routing = RouterModule.forRoot(appRoutes)