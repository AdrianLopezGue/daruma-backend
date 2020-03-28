import { Module, OnModuleInit } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { ConfigModule } from 'nestjs-config';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.load(
      path.resolve(__dirname, 'config/**/!(*.d).config.{ts,js}'),
      {
        modifyConfigName: name => name.replace('.config', ''),
      },
    ),
    CqrsModule,
  ],
})
export class BootstrapModule implements OnModuleInit {
  constructor(
    private readonly event$: EventBus,
  ) {}

  onModuleInit() {
  }
}
