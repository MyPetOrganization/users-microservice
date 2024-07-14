import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { bucket } from '../firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto, image?: Express.Multer.File) {
    const salt = await bcrypt.genSalt(10);

    let imageUrl: string = null;
    if (image) {
      imageUrl = await this.uploadImageToFirebase(image);
    }
    console.log("URL: ", imageUrl);

    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.favoriteMovie = await bcrypt.hash(createUserDto.favoriteMovie, salt);

    const userData: User = {
      ...createUserDto,
      profileImage: imageUrl,
      products: [],
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined
    };

    return await this.usersRepository.save(userData);
  }

  private async uploadImageToFirebase(file: Express.Multer.File): Promise<string> {
    const fileName = `users/${uuidv4().substring(0,8)}-${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    await fileUpload.save(file.buffer, {
      metadata: { contentType: file.mimetype },
      public: true,
    });

    const [url] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });

    return url;
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    return user;
  }

  async findOne(id: number) {
    if (isNaN(id)) {
      throw new Error('Invalid user ID');
    }
    return this.usersRepository.findOneBy({id});
  }

  async resetPassword(id: number, password: string, favoriteMovie: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    if (!bcrypt.compare(favoriteMovie, user.favoriteMovie)) {
      throw new Error('Invalid favorite movie');
    }
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);
    return await this.usersRepository.update(id, { password: newPassword });
  }

  async update(id: number, updateUserDto: UpdateUserDto, image?: Express.Multer.File) {
    const user = await this.findOne(id);

    if (!user) {
      throw new Error('User not found');
    }
    if (image) {
      const imageUrl = await this.uploadImageToFirebase(image);
      updateUserDto.profileImage = imageUrl;
    }
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }
    
    const { id: __, ...data} = updateUserDto;
    
    this.usersRepository.merge(user, data);
    return await this.usersRepository.save(user);
  }

  async remove(id: number) {
    return await this.usersRepository.softDelete(id);
  }
}
