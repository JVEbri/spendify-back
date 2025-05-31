import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupsRepository } from './groups.repository';
import { User } from '../users/users.entity';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class GroupsService {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    @InjectRepository(User)
    private readonly usersRepository: UsersRepository,
  ) {}

  async createGroup(name: string, ownerId: string) {
    const owner = await this.usersRepository.findOne({ where: { id: ownerId } });
    if (!owner) throw new Error('Usuario no encontrado');

    const group = this.groupsRepository.create({ name, owner });
    const savedGroup = await this.groupsRepository.save(group);

    return this.groupsRepository.addUserToGroup(savedGroup.id, owner);
  }

  async addUserToGroup(userId: string, groupId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('Usuario no encontrado');

    return this.groupsRepository.addUserToGroup(groupId, user);
  }

  async getGroups(userId: string) {
    return this.groupsRepository.getGroupsForUser(userId);
  }
}
