import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login') async loginAdmin(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.loginAdmin(
        loginDto.email,
        loginDto.password,
      );
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Post('service-provider/login') async loginPrestador(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.loginServiceProvider(
        loginDto.email,
        loginDto.password,
      );
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
