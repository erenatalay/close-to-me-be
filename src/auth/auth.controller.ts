import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthRegisterRequestDto } from './dto/register-request-auth.dto';
import { AuthLoginRequestDto } from './dto/login-request-auth.dto';

@Controller({ path: 'auth', version: '1' })
@ApiTags('Auth')
export class AuthController {
  private readonly redirectUrl: string;

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'User register' })
  @ApiResponse({
    status: 200,
    description: 'Successful register',
    type: AuthRegisterRequestDto,
  })
  @ApiBody({ type: AuthRegisterRequestDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async register(@Body() registerUserDto: AuthRegisterRequestDto) {
    const response =
      await this.authService.registerUserService(registerUserDto);
    return {
      message: 'Successfully register user!',
      data: response,
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    type: AuthLoginRequestDto,
  })
  @ApiBody({ type: AuthLoginRequestDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: AuthLoginRequestDto) {
    const response = await this.authService.loginUserService(loginUserDto);
    return {
      message: 'Successfully login user!',
      data: response,
    };
  }
}
