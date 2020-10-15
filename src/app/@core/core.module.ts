import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { NbAuthModule } from '@nebular/auth';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { CollegeService } from './services/college.service';
import { LayoutService, StateService, } from './utils';


const DATA_SERVICES = [
];

export const NB_CORE_PROVIDERS = [
  ...DATA_SERVICES,
  LayoutService,
  StateService,
  CollegeService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    NbAuthModule,
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}
