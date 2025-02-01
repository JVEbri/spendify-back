import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from 'src/users/users.entity';
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createGroup(@Body('name') name: string, @Req() @CurrentUser() user: User) {
    const ownerId = user.id;

    return this.groupsService.createGroup(name, ownerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getGroups(@Req() @CurrentUser() user: User) {
    const groups = await this.groupsService.getGroups(user.id);
    return groups;
  }
}
