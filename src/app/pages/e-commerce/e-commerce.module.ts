import { NgModule } from '@angular/core';
import { FormsModule as ngFormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ReactiveFormsModule } from '@angular/forms';

import {
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbIconModule,
    NbInputModule,
    NbListModule,
    NbProgressBarModule,
    NbRadioModule,
    NbSelectModule, NbSpinnerModule,
    NbTabsetModule,
    NbUserModule,
} from '@nebular/theme';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import { NgxEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { ClassRoomManagementCardComponent } from './class-room-management-card/class-room-management-card.component';

import { ECommerceComponent } from './e-commerce.component';
import { ProfessorManagementCardComponent } from './professor-management-card/professor-management-card.component';
import { SubjectsManagementCardComponent } from './subjecs-management-card/subjects-management-card.component';


const COMPONENTS = [
    SubjectsManagementCardComponent,
    ProfessorManagementCardComponent,
    ClassRoomManagementCardComponent,
];

@NgModule({
    imports: [
        ThemeModule,
        NbCardModule,
        NbUserModule,
        NbButtonModule,
        NbIconModule,
        NbTabsetModule,
        NbSelectModule,
        NbListModule,
        ChartModule,
        NbProgressBarModule,
        NgxEchartsModule,
        NgxChartsModule,
        LeafletModule,
        NbCheckboxModule,
        NbDatepickerModule,
        NbInputModule,
        NbRadioModule,
        ngFormsModule,
        ReactiveFormsModule,
        NbSpinnerModule,
    ],
    declarations: [
        ECommerceComponent,
        ...COMPONENTS,
    ],
    providers: [],
})
export class ECommerceModule {
}
