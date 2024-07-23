import { IsString, IsEmail, IsIn, MinLength, IsOptional  } from 'class-validator';
import { Transform } from "class-transformer";

/**
 * Data transfer object with expected fields for creating a new user
 */
export class CreateUserDto {

    /**
     * The user's name
     * Verify that the name is a string
     * @example John Doe
     */
    @IsString()
    public name: string;

    /**
     * The user's email
     * Verify that the email is in the correct format
     * @example johndoe@example.com
     */
    @IsEmail()
    public email: string;

    /**
     * The user's password
     * Verify that the password is a string and at least 8 characters long
     * @example password123
     */
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(8,{
        message: 'password must be at least 8 characters'
    })
    public password: string;

    /** 
     * The user's security question
     * Verify that the security question is a string and at least 1 character long
     * @example Fast and Furious
     */
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    favoriteMovie: string;

    /**
     * The user's role
     * Verify that the role is a string and is either 'admin', 'buyer', or 'seller'
     * @example buyer
     */
    @IsString()
    @IsIn(['admin', 'buyer', 'seller'])
    public role: string;

    /**
     * URL of the user's profile image.
     * Verify that the profile image is a string
     * @example https://example.com/profile.jpg
     */
    @IsString()
    @IsOptional()
    public profileImage?: string;
}
