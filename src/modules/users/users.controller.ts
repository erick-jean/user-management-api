import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiQuery,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiParam,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { PaginatedUsersResponseDto } from './dto/paginated-users-response.dto';
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
  
  // Resposta de sucesso status 200
  @ApiOkResponse({
    description: 'Lista paginada de usuarios retornada com sucesso',
    type: PaginatedUsersResponseDto,
  })

  // Paginação
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })

  // Respostas de erro status 500
  @ApiInternalServerErrorResponse({
    description: 'Erro interno no servidor',
  })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginatedUsersResponseDto> {
    return this.usersService.findAll(page, limit);
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
