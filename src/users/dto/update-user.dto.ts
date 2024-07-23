import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNumber, IsPositive } from 'class-validator';

/**
 * The Data Transfer Object (DTO) for updating a user
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
    /**
     * The user's is
     * Verify that the user id arrives
     * Verify that the id is a number and is positive
     * @example 1
     */
    @IsNumber()
    @IsPositive()
    id: number;
}
