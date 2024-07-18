import { Controller, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserPayload } from './interfaces/create-user-payload';
import { Readable } from 'stream';
import { UpdateUserPayload } from './interfaces/update-user-payload';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  @MessagePattern({ cmd: 'create_user' })
  // @UseInterceptors(FileInterceptor('image'))
  async create(
    @Payload() payload: CreateUserPayload,
  ) {
    const image = payload.image;
    const createUserDto = payload.createUserDto;
    let file: Express.Multer.File = null;
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

  // @Get()
  @MessagePattern({ cmd: 'get_all_users' })
  async findAll() {
    return await this.usersService.findAll();
  }

  // @Get(':id')
  @MessagePattern({ cmd: 'get_one_user' })
  async findOne(@Payload('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  // @Patch(':id')
  @MessagePattern({ cmd: 'update_user' })
  async update(
    // @Param('id') id: string, 
    // @Body() updateUserDto: UpdateUserDto, 
    @Payload() payload: UpdateUserPayload,
    // @UploadedFile() image?: Express.Multer.File
  ){
    const image = payload.image;
    const updateUserDto = payload.updateUserDto;
    const id = payload.id;
    let file: Express.Multer.File
    if (image){
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

    return await this.usersService.update( id, updateUserDto, file);
  }

  @MessagePattern({ cmd: 'get_user_by_email' })
async findByEmail(@Payload() payload: { email: string }) {
  const { email } = payload;

  return await this.usersService.findOneByEmail(email);
}


  // @Delete(':id')
  @MessagePattern({ cmd: 'delete_user' })
  async remove(@Payload('id') id: string) {
    return await this.usersService.remove(+id);
  }
}
