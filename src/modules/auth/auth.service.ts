import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { UserRole } from '../users/enums/user-role.enum';
import { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import { LoginDto } from './dto/login.dto';

const userProfileSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
} as const;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
      },
    });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role as UserRole,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  async me(currentUser: AuthenticatedUser): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: currentUser.userId },
      select: userProfileSelect,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
