import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/')
  public getUsers() {
    return this.userService.getUsers();
  }

  @Get('/:id')
  public getUser(@Param('id', new ParseUUIDPipe()) id: User['id']) {
    const user = this.userService.getUser(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
}
