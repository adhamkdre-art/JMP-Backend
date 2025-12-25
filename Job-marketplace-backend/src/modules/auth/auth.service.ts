import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from './firebase.service';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly firebaseService: FirebaseService,
    private readonly usersService: UsersService,
  ) {}

  async sendOTP(phoneNumber: string): Promise<{ message: string }> {
    // Validate phone number format
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      throw new BadRequestException('Invalid phone number format. Use E.164 format (e.g., +1234567890)');
    }

    return {
      message: 'OTP sent successfully. Use Firebase client SDK to receive and verify OTP.',
    };
  }

  async verifyOTP(phoneNumber: string, idToken: string) {
    try {
      const decodedToken = await this.firebaseService.verifyIdToken(idToken);

      if (decodedToken.phone_number !== phoneNumber) {
        throw new UnauthorizedException('Phone number mismatch');
      }

      let user = await this.usersService.findByPhoneNumber(phoneNumber);

      if (!user) {
        user = await this.usersService.create({
          phoneNumber,
          firebaseUid: decodedToken.uid,
          currentRole: UserRole.CUSTOMER,
          availableRoles: [UserRole.CUSTOMER],
          isVerified: true,
        });
      } else {
        await this.usersService.updateLastLogin(user.id);
      }

      const payload = {
        sub: user.id,
        phone: user.phoneNumber,
        role: user.currentRole,
      };
      const accessToken = this.jwtService.sign(payload);

      return {
        accessToken,
        user: {
          id: user.id,
          phoneNumber: user.phoneNumber,
          name: user.name,
          email: user.email,
          currentRole: user.currentRole,
          availableRoles: user.availableRoles,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid OTP or token');
    }
  }

  async switchRole(userId: string, newRole: UserRole) {
    const user = await this.usersService.findById(userId);

    if (!user.availableRoles.includes(newRole)) {
      throw new BadRequestException('Role not available for this user');
    }

    await this.usersService.updateRole(userId, newRole);

    const payload = { sub: user.id, phone: user.phoneNumber, role: newRole };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, currentRole: newRole };
  }

  async enableProviderRole(userId: string) {
    const user = await this.usersService.findById(userId);

    if (user.availableRoles.includes(UserRole.PROVIDER)) {
      throw new BadRequestException('Provider role already enabled');
    }

    const updatedRoles = [...user.availableRoles, UserRole.PROVIDER];
    await this.usersService.updateAvailableRoles(userId, updatedRoles);

    return {
      message: 'Provider role enabled successfully',
      availableRoles: updatedRoles,
    };
  }

  async refreshToken(userId: string) {
    const user = await this.usersService.findById(userId);

    const payload = {
      sub: user.id,
      phone: user.phoneNumber,
      role: user.currentRole,
    };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async validateUser(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }
    return user;
  }
}