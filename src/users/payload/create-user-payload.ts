import { CreateUserDto } from "../dto/create-user.dto";

export interface CreateUserPayload {
    image:{
        buffer: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
    }
    createUserDto: CreateUserDto;
}