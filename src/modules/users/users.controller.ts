import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginatedUsersResponseDto } from './dto/paginated-users-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from './enums/user-role.enum';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'List users',
    description: 'Returns a paginated list of users registered in the system',
  })
  @ApiOkResponse({
    description: 'Paginated list of users returned successfully',
    type: PaginatedUsersResponseDto,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Number of items per page (max 100)',
  })
  @ApiBadRequestResponse({
    description: 'Invalid pagination parameters',
  })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginatedUsersResponseDto> {
    return this.usersService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Returns a specific user based on the provided ID',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID (UUID)',
  })
  @ApiOkResponse({
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create user',
    description: 'Creates a new user in the system',
  })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data for user creation',
  })
  @ApiConflictResponse({
    description: 'A user with this email already exists',
  })
  create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user',
    description: 'Updates an existing user in the system',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID (UUID)',
  })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID or invalid data for user update',
  })
  @ApiConflictResponse({
    description: 'A user with this email already exists',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove user',
    description: 'Removes a user from the system by ID',
  })
  @ApiNoContentResponse({
    description: 'User removed successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
