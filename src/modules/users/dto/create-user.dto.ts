import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name!: string;

  @ApiProperty({ example: 'john@email.com' })
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password!: string;

  @ApiPropertyOptional({
    example: UserRole.USER,
    default: UserRole.USER,
    enum: [UserRole.USER, UserRole.ADMIN],
  })
  @IsOptional()
  @IsString()
  @IsIn([UserRole.USER, UserRole.ADMIN])
  @MaxLength(20)
  role?: UserRole;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
