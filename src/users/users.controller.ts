import { Controller, Post, Body, BadRequestException, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// custom-request.interface.ts
import { Request } from 'express';

export interface CustomRequest extends Request {
  user: any; // You can replace 'any' with a more specific type if you have one
}

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body('email') email: string, @Body('password') password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      throw new BadRequestException('Email already exists');
    }
    return this.usersService.register(email, password);
  }

  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: CustomRequest) { // Usa @Req para obtener el objeto request
    console.log('User in Request:', req.user);
    return req.user ? req.user : 'No user found';
  }
  
  
}

