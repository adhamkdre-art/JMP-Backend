import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

class SendOtpDto {
  phoneNumber: string;
}

class VerifyOtpDto {
  phoneNumber: string;
  idToken: string;
}

class SwitchRoleDto {
  role: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP to phone number' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  async sendOTP(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOTP(sendOtpDto.phoneNumber);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP and login/register user' })
  @ApiResponse({ status: 200, description: 'User authenticated successfully' })
  @ApiResponse({ status: 401, description: 'Invalid OTP or token' })
  async verifyOTP(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOTP(
      verifyOtpDto.phoneNumber,
      verifyOtpDto.idToken,
    );
  }

  @Post('switch-role')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Switch between customer and provider roles' })
  @ApiResponse({ status: 200, description: 'Role switched successfully' })
  @ApiResponse({ status: 400, description: 'Role not available for user' })
  async switchRole(@Request() req, @Body() switchRoleDto: SwitchRoleDto) {
    return this.authService.switchRole(req.user.userId, switchRoleDto.role);
  }

  @Post('enable-provider')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Enable provider role for current user' })
  @ApiResponse({ status: 200, description: 'Provider role enabled' })
  @ApiResponse({ status: 400, description: 'Provider role already enabled' })
  async enableProvider(@Request() req) {
    return this.authService.enableProviderRole(req.user.userId);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.userId);
  }
}