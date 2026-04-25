import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';

const userListSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
} satisfies Prisma.UserSelect;

type UserListItem = Prisma.UserGetPayload<{
  select: typeof userListSelect;
}>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      select: userListSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users.map((user) => this.toResponse(user));
  }

  private toResponse(user: UserListItem): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin,
    };
  }
}
