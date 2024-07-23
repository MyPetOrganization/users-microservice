import { Controller, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserPayload } from './interfaces/create-user-payload';
import { Readable } from 'stream';
import { UpdateUserPayload } from './interfaces/update-user-payload';
import { ResetPasswordPayload } from './interfaces/reset-password.payload';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /**
   * Creates a new user.
   * @param payload - The payload to create a user.
   * @returns The created user.
   */
  @MessagePattern({ cmd: 'create_user' })
  async create(
    @Payload() payload: CreateUserPayload,
  ) {
    // The image of the user
    const image = payload.image;
    // The user data to create the user
    const createUserDto = payload.createUserDto;
    let file: Express.Multer.File = null;
    // If there is an image, create a file object from the image to be used in the service
    if (image) {
      const imageBuffer = Buffer.from(image.buffer, 'base64');
      file = {
        buffer: imageBuffer,
        originalname: image.originalname,
        encoding: image.encoding,
        mimetype: image.mimetype,
        size: image.size,
        fieldname: '',
        stream: new Readable,
        destination: '',
        filename: '',
        path: ''
      };
    }

    return await this.usersService.create(createUserDto, file);
  }

  /**
   * Finds all users.
   * @returns 
   */
  @MessagePattern({ cmd: 'get_all_users' })
  async findAll() {
    return await this.usersService.findAll();
  }

  /**
   * Finds a user by id.
   * @param id - The user's id
   * @returns The user with the specified id
   */
  @MessagePattern({ cmd: 'get_one_user' })
  async findOne(@Payload('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  /**
   * Updates a user.
   * @param payload - The payload to update a user.
   * @returns The updated user.
   */
  @MessagePattern({ cmd: 'update_user' })
  async update(
    @Payload() payload: UpdateUserPayload,
  ) {
    // The image of the user
    const image = payload.image;
    // The user data to update the user
    const updateUserDto = payload.updateUserDto;
    // The id of the user to update
    const id = payload.id;
    let file: Express.Multer.File
    // If there is an image, create a file object from the image to be used in the service
    if (image) {
      const imageBuffer = Buffer.from(image.buffer, 'base64');
      file = {
        buffer: imageBuffer,
        originalname: image.originalname,
        encoding: image.encoding,
        mimetype: image.mimetype,
        size: image.size,
        fieldname: '',
        stream: new Readable,
        destination: '',
        filename: '',
        path: ''
      };
    }

    return await this.usersService.update(id, updateUserDto, file);
  }

  /**
   * Resets the user's password.
   * @param payload - The payload to reset the user's password.
   * @returns The result of the password reset.
   */
  @MessagePattern({ cmd: 'reset_password' })
  async resetPassword(
    @Payload() payload: ResetPasswordPayload
  ) {
    // The user data to reset the password
    const { email, newPassword, favoriteMovie } = payload;
    return await this.usersService.resetPassword(email, newPassword, favoriteMovie);
  }
  
  /**
   * Finds a user by email.
   * @param payload - The payload to find a user by email.
   * @returns The user with the specified email.
   */
  @MessagePattern({ cmd: 'get_user_by_email' })
  async findByEmail(@Payload() payload: { email: string }) {
    const { email } = payload;
    return await this.usersService.findOneByEmail(email);
  }


  /**
   * Deletes a user.
   * @param id - The user's id
   * @returns The result of the deletion operation.
   */
  @MessagePattern({ cmd: 'delete_user' })
  async remove(@Payload('id') id: string) {
    return await this.usersService.remove(+id);
  }
}
