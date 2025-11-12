import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('registro')
  registro(@Body() createUserDto: CreateUserDto) {
    return this.userService.registro(createUserDto);
  }

  @Post('login')
  findOne(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }
}
