import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Request } from 'express';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createGroup(@Body('name') name: string, @Req() req: Request) {
    const user = req.user; // El usuario autenticado extraído del token
    const ownerId = user.id;

    return this.groupsService.createGroup(name, ownerId);
  }
}
