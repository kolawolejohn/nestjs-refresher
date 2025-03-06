import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/user-register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { HttpResponse } from 'src/responses/http.response';

@Controller('auth')
export class AuthController {
  public constructor(
    private readonly authService: AuthService,
    private readonly response: HttpResponse,
  ) {}

  @Post('register')
  async register(@Res() res: Response, @Body() dto: RegisterUserDto) {
    const response = await this.authService.register(dto);
    return this.response.createdResponse(
      res,
      'Registration done Successfully',
      response,
    );
  }

  @Post('login')
  async login(@Res() res: Response, @Body() dto: LoginDto) {
    const response = await this.authService.login(dto);
    return this.response.okResponse(
      res,
      'Registration done Successfully',
      response,
    );
  }
}
