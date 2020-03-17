import { Global, Module } from '@nestjs/common';

import { BootstrapModule } from './bootstrap.module';

@Global()
@Module({
  imports: [BootstrapModule],
})
export class AppModule {}
