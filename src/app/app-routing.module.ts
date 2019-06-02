import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: "logged", pathMatch: 'full' },
    { path: 'login', loadChildren: './resources/pages/login/login.module#LoginPageModule' },
    { path: 'register', loadChildren: './resources/pages/register/register.module#RegisterPageModule' },
    { path: 'logged', loadChildren: './resources/pages/logged/logged.module#LoggedPageModule' }
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
