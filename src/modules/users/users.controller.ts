import { Controller, Get, Post, Patch, Delete, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiParam,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar usuarios',
    description: 'Retorna uma lista de usuarios cadastrados no sistema',
  })
  @ApiOkResponse({
    description: 'Lista de usuarios retornada com sucesso',
    type: UserResponseDto,
    isArray: true,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor',
    example: {
      statusCode: 500,
      message: 'Internal server error',
    },
  })
  findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
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
