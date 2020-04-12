import { FirebaseDatabase } from './firebase';
import { Module } from '@nestjs/common';

@Module({
  providers: [FirebaseDatabase],
  exports: [FirebaseDatabase],
})
export class FirebaseModule {}
