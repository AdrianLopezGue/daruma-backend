import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { FirebaseDatabase } from './firebase';
import { FirebaseAuthService } from './firebase.auth.service';
import { FirebaseStrategy } from './firebase.strategy';

@Module({
  imports: [PassportModule],
  providers: [FirebaseAuthService, FirebaseDatabase, FirebaseStrategy],
  exports: [FirebaseDatabase, FirebaseStrategy],
})
export class FirebaseModule {}
