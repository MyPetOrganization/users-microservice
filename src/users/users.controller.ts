import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  @MessagePattern({ cmd: 'create_product' })
  // @UseInterceptors(FileInterceptor('image'))
  async create(
    @Payload() createUserDto: CreateUserDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return await this.usersService.create(createUserDto, image);
  }

  // @Get()
  @MessagePattern({ cmd: 'get_all_products' })
  async findAll() {
    return await this.usersService.findAll();
  }

  // @Get(':id')
  @MessagePattern({ cmd: 'get_one_product' })
  async findOne(@Payload('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  // @Patch(':id')
  @MessagePattern({ cmd: 'update_product' })
  async update(
    // @Param('id') id: string, 
    // @Body() updateUserDto: UpdateUserDto, 
    @Payload() updateUserDto: UpdateUserDto,
    @UploadedFile() image?: Express.Multer.File
  ){
    return await this.usersService.update(updateUserDto.id, updateUserDto, image);
  }
  
  // @Delete(':id')
  @MessagePattern({ cmd: 'delete_product' })
  async remove(@Payload('id') id: string) {
    return await this.usersService.remove(+id);
  }
}
