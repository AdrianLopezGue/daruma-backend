import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { FirebaseDatabase } from './firebase';
import { FirebaseProvider } from './firebase.provider';
import { FirebaseStrategy } from './firebase.strategy';

@Module({
  imports: [PassportModule],
  providers: [FirebaseDatabase, FirebaseStrategy, ...FirebaseProvider],
  exports: [FirebaseDatabase, FirebaseStrategy, ...FirebaseProvider],
})
export class FirebaseModule {}
