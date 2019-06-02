import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedPage } from './logged.page';


const routes: Routes = [
    {
        path: '',
        component: LoggedPage,
        children: [
            {
                path: 'home',
                children: [
                    {
                        path: '',
                        loadChildren: './home/home.module#HomePageModule'
                    }
                ]
            },
            {
                path: 'search',
                children: [
                    {
                        path: '',
                        loadChildren: './search/search.module#SearchPageModule'
                    }
                ]
            },
            {
                path: 'favourites',
                children: [
                    {
                        path: '',
                        loadChildren: './favourites/favourites.module#FavouritesPageModule'
                    }
                ]
            },
            {
                path: 'reminders',
                children: [
                    {
                        path: '',
                        loadChildren: './reminders/reminders.module#RemindersPageModule'
                    }
                ]
            },
            {
                path: 'profile',
                children: [
                    {
                        path: '',
                        loadChildren: './profile/profile.module#ProfilePageModule'
                    }
                ]
            },
            {
                path: 'change-password',
                children: [
                    {
                        path: '',
                        loadChildren: './change-password/change-password.module#ChangePasswordPageModule'
                    }
                ]
            },
            {
                path: '',
                redirectTo: '/logged/home',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/logged/home',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [ RouterModule ]
})
export class LoggedRouterModule
{
}
