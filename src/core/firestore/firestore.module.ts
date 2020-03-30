import { FirestoreDatabase } from './firestore';
import { Module } from '@nestjs/common';


@Module({
  providers: [FirestoreDatabase],
  exports: [FirestoreDatabase],
})

export class FirestoreModule {}