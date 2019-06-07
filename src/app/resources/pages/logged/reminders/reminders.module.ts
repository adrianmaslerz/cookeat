import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RemindersPage } from './reminders.page';
import { ReminderModalPage } from './reminder-modal/reminder-modal.page';

const routes: Routes = [
  {
    path: '',
    component: RemindersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RemindersPage, ReminderModalPage],
  entryComponents: [ ReminderModalPage ]
})
export class RemindersPageModule {}
