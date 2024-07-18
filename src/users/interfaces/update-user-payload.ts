import { UpdateUserDto } from "../dto/update-user.dto";

export interface UpdateUserPayload {
    id: number;
    image:{
        buffer: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
    }
    updateUserDto: UpdateUserDto;
}