import { UpdateUserDto } from "../dto/update-user.dto";

/**
 * The payload to update a user
 */
export interface UpdateUserPayload {
    // The user's id
    id: number;
    // The user's profile image
    image:{
        buffer: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
    }
    // The user's updated information
    updateUserDto: UpdateUserDto;
}