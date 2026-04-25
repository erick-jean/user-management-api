import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login user',
    description: 'Authenticates a user and returns a JWT access token',
  })
  @ApiOkResponse({
    description: 'User authenticated successfully',
    schema: {
      example: {
        accessToken: 'your-jwt-token',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid login data',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }
}
