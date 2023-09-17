import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDTO } from './dtos/Register.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  public register(@Body() userData: RegisterDTO) {
    return this.authService.register(userData);
  }
}
