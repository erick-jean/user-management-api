import { Controller, Get, Post, Patch, Delete, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiParam,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { PaginatedUsersResponseDto } from './dto/paginated-users-response.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar usuarios',
    description: 'Retorna uma lista paginada de usuarios cadastrados no sistema',
  })
  @ApiOkResponse({
    description: 'Lista paginada de usuarios retornada com sucesso',
    type: PaginatedUsersResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor',
  })
  findAll(
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginatedUsersResponseDto> {
    return this.usersService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description: 'Retorna um usuário específico com base no ID fornecido',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do usuário (UUID)',
  })
  @ApiOkResponse({
    description: 'Usuário encontrado',
    type: UserResponseDto,
    isArray: false,
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado',
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor',
  })
  findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Post()
  create() {}

  @Patch(':id')
  update() {}

  @Delete(':id')
  remove() {}
}
