import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginatedUsersResponseDto } from './dto/paginated-users-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserRole } from './enums/user-role.enum';

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

// Constantes para paginação
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

type UserListItem = Prisma.UserGetPayload<{
  select: typeof userListSelect;
}>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createUserDto: CreateUserDto,
    currentUser: AuthenticatedUser,
  ): Promise<UserResponseDto> {
    if (
      createUserDto.role === UserRole.ADMIN &&
      currentUser.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException('Only admins can create admin users');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role ?? 'user',
        isActive: createUserDto.isActive ?? true,
      },
      select: userListSelect,
    });

    return this.toResponse(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUser: AuthenticatedUser,
  ): Promise<UserResponseDto> {
    const isAdmin = currentUser.role === UserRole.ADMIN;
    const isSelf = currentUser.userId === id;

    if (!isAdmin && !isSelf) {
      throw new ForbiddenException('You can only update your own account');
    }

    if (
      !isAdmin &&
      (updateUserDto.role !== undefined || updateUserDto.isActive !== undefined)
    ) {
      throw new ForbiddenException(
        'You are not allowed to update role or active status',
      );
    }

    try {
      const data: Prisma.UserUpdateInput = {
        name: updateUserDto.name,
        email: updateUserDto.email,
        role: isAdmin ? updateUserDto.role : undefined,
        isActive: isAdmin ? updateUserDto.isActive : undefined,
      };

      if (updateUserDto.password) {
        data.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      const user = await this.prisma.user.update({
        where: { id },
        data,
        select: userListSelect,
      });

      return this.toResponse(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User not found');
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email already in use');
      }

      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User not found');
      }

      throw error;
    }
  }

  async findAll(
    page: number,
    limit: number,
    currentUser: AuthenticatedUser,
  ): Promise<PaginatedUsersResponseDto> {
    if (currentUser.role !== UserRole.ADMIN) {
      const user = await this.prisma.user.findUnique({
        where: { id: currentUser.userId },
        select: userListSelect,
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        data: [this.toResponse(user)],
        meta: {
          page: 1,
          limit: 1,
          totalItems: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }

    const sanitizedPage = Math.max(DEFAULT_PAGE, page);
    const sanitizedLimit = Math.min(Math.max(DEFAULT_LIMIT, limit), MAX_LIMIT);
    const skip = (sanitizedPage - 1) * sanitizedLimit;

    const [totalItems, users] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.user.findMany({
        skip,
        take: sanitizedLimit,
        select: userListSelect,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / sanitizedLimit);

    return {
      data: users.map((user) => this.toResponse(user)),
      meta: {
        page: sanitizedPage,
        limit: sanitizedLimit,
        totalItems,
        totalPages,
        hasNextPage: sanitizedPage < totalPages,
        hasPreviousPage: sanitizedPage > 1,
      },
    };
  }

  async findOne(
    id: string,
    currentUser: AuthenticatedUser,
  ): Promise<UserResponseDto> {
    const isAdmin = currentUser.role === UserRole.ADMIN;
    const isSelf = currentUser.userId === id;

    if (!isAdmin && !isSelf) {
      throw new ForbiddenException('You can only access your own account');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userListSelect,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toResponse(user);
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
