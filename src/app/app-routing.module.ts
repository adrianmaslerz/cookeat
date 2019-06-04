import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

const routes: Routes = [
    { path: '', redirectTo: "logged", pathMatch: 'full' },
    { path: 'login', loadChildren: './resources/pages/login/login.module#LoginPageModule', canLoad: [ NoAuthGuard ] },
    { path: 'register', loadChildren: './resources/pages/register/register.module#RegisterPageModule', canLoad: [ NoAuthGuard ] },
    { path: 'logged', loadChildren: './resources/pages/logged/logged.module#LoggedPageModule', canLoad: [ AuthGuard ] }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [ RouterModule ]
})
export class AppRoutingModule
{
}
