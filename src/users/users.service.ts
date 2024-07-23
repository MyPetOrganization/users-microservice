import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { bucket } from '../firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Creates method to create a new user.
   * @param createUserDto - The user data to create a user.
   * @param image - The image of the user.
   * @returns - The created user.
   */
  async create(createUserDto: CreateUserDto, image?: Express.Multer.File) {
    // Generate a salt to hash the password.
    const salt = await bcrypt.genSalt(10);
    // If there is an image, upload the image to Firebase and get the image URL.
    let imageUrl: string = null;
    if (image) {
      imageUrl = await this.uploadImageToFirebase(image);
    }
    // Hash the password and security question (favorite movie).
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.favoriteMovie = await bcrypt.hash(createUserDto.favoriteMovie, salt);

    // Create the user data with all the entity information.
    const userData: User = {
      ...createUserDto,
      profileImage: imageUrl,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined
    };

    return await this.usersRepository.save(userData);
  }

  /**
   * Uploads an image to Firebase.
   * @param file - The file to upload to Firebase.
   * @returns The URL of the uploaded file.
   */
  private async uploadImageToFirebase(file: Express.Multer.File): Promise<string> {
    // Generate a random file name to identify the file.
    const fileName = `users/${uuidv4().substring(0,8)}-${file.originalname}`;
    // Create a file object with the file name.
    const fileUpload = bucket.file(fileName);
    // Save the file to Firebase with the file buffer and metadata.
    await fileUpload.save(file.buffer, {
      metadata: { contentType: file.mimetype },
      public: true,
    });
    // Get the signed URL of the file.
    const [url] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });

    return url;
  }

  /**
   * Finds all users method.
   * @returns All users.
   */
  async findAll() {
    return await this.usersRepository.find();
  }

  /**
   * Finds a user by email method.
   * @param email - The user's email.
   * @returns The user with the specified email.
   */
  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    return user;
  }

  /**
   * Finds a user by id method.
   * @param id - The user's id.
   * @returns The user with the specified id.
   * */
  async findOne(id: number) {
    // Check if the user exists.
    if (isNaN(id)) {
      throw new Error('Invalid user ID');
    }
    return await this.usersRepository.findOneBy({id});
  }

  /**
   * Resets the user's password method.
   * @param email - The user's email.
   * @param password - The new password.
   * @param favoriteMovie - The favorite movie.
   * @returns The result of the password reset.
   */
  async resetPassword(email: string, newPassword: string, favoriteMovie: string) {
    // Find the user by id.
    const user = await this.findOneByEmail(email);
    // Check if the user exists.
    if (!user) {
      throw new BadRequestException('User not found');
    }
    // Verify the secret question.
    const isFavoriteMovieValid = await bcrypt.compare(favoriteMovie, user.favoriteMovie);
    if (!isFavoriteMovieValid) {
      throw new BadRequestException('Invalid favorite movie');
    }

    return await this.usersRepository.update(user.id, { password: newPassword });
  }

  /**
   * Updates a user method.
   * @param id - The user's id.
   * @param updateUserDto - The user data to update the user.
   * @param image - The image of the user.
   * @returns The updated user.
   */
  async update(id: number, updateUserDto: UpdateUserDto, image?: Express.Multer.File) {
    // Find the user by id.
    const user = await this.findOne(id);
    // Check if the user exists.
    if (!user) {
      throw new Error('User not found');
    }
    // If there is an image, upload the image to Firebase and get the image URL
    if (image) {
      const imageUrl = await this.uploadImageToFirebase(image);
      updateUserDto.profileImage = imageUrl;
    }
    // Generate a salt to hash the password.
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }
    // Avoid updating the id
    const { id: __, ...data} = updateUserDto;
    // Merge the user data with the new data.
    this.usersRepository.merge(user, data);
    return await this.usersRepository.save(user);
  }

  /**
   * Deletes a user method.
   * @param id - The user's id.
   * @returns The result of the deletion operation.
   */
  async remove(id: number) {
    return await this.usersRepository.softDelete(id);
  }
}
