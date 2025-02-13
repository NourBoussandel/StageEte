import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {registerLicense} from '@syncfusion/ej2-base'

import { AppModule } from './app/app.module';

registerLicense("ORg4AjUWIQA/Gnt2VlhhQlJCfV5DQmFPYVF2R2BJfFR1cV9CYEwxOX1dQl9gSH5RcURlWH5beHNTR2g=");

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
