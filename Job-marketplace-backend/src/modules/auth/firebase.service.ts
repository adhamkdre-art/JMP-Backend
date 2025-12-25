import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: admin.app.App;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    try {
      const serviceAccountJson = this.configService.get<string>(
        'FIREBASE_SERVICE_ACCOUNT',
      );

      if (!serviceAccountJson) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set');
      }

      const serviceAccount = JSON.parse(serviceAccountJson);

      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      console.log('✅ Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.error('❌ Firebase Admin SDK initialization failed:', error.message);
      throw error;
    }
  }

  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      return await this.firebaseApp.auth().verifyIdToken(idToken);
    } catch (error) {
      throw new Error('Failed to verify Firebase ID token');
    }
  }

  getAuth(): admin.auth.Auth {
    return this.firebaseApp.auth();
  }
}