import { Module } from '@nestjs/common';

import { DatabaseProvider } from './database.provider';

@Module({
  providers: [...DatabaseProvider],
  exports: [...DatabaseProvider],
})
export class DatabaseModule {}
