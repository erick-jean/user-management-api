import { Controller, Get, Post, Patch, Delete } from '@nestjs/common';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiOkResponse,
//   ApiInternalServerErrorResponse,
// } from '@nestjs/swagger';
// import { UsersService } from './users.service';
// import { UserResponseDto } from './dto/user-response.dto';

// @ApiTags('users')
// @Controller('users')
// export class UsersController {
//   constructor(private readonly usersService: UsersService) {}
//
//   @Get()
//   @ApiOperation({
//     summary: 'Listar usuarios',
//     description: 'Retorna uma lista de usuarios cadastrados no sistema',
//   })
//   @ApiOkResponse({
//     description: 'Lista de usuarios retornada com sucesso',
//     type: UserResponseDto,
//     isArray: true,
//   })
//   @ApiInternalServerErrorResponse({
//     description: 'Erro interno no servidor',
//     example: {
//       statusCode: 500,
//       message: 'Internal server error',
//     },
//   })
//   findAll(): Promise<UserResponseDto[]> {
//     return this.usersService.findAll();
//   }
// }

@Controller('users')
export class UsersController {
  @Get()
  findAll() {}

  @Get(':id')
  findOne() {}

  @Post()
  create() {}

  @Patch(':id')
  update() {}

  @Delete(':id')
  remove() {}
}
