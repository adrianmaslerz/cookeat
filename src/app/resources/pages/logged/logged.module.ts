import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LoggedPage } from './logged.page';
import { LoggedRouterModule } from './logged.router.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoggedRouterModule
  ],
  declarations: [LoggedPage]
})
export class LoggedPageModule {}
