import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {


    @IsEmail()
    @IsOptional()
    public email?: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @IsOptional()
    @MinLength(8,{
        message: 'password must be at least 8 characters'
    })
    public password?: string;

    @IsString()
    @IsOptional()
    public profileImage?: string;
}
