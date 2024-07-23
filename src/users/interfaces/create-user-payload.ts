import { CreateUserDto } from "../dto/create-user.dto";

/**
 * The payload to create a user
 */
export interface CreateUserPayload {
    // The user's profile image
    image:{
        buffer: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
    }
    // The user's registration information
    createUserDto: CreateUserDto;
}