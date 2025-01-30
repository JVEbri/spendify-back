import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './groups.entity';
import { User } from '../users/users.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group) private readonly groupRepository: Repository<Group>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createGroup(name: string, ownerId: string): Promise<Group> {
    const owner = await this.userRepository.findOne({ where: { id: ownerId } });

    if (!owner) {
      throw new Error('Usuario no encontrado');
    }

    const group = this.groupRepository.create({
      name,
      owner,
      users: [owner],
    });

    return this.groupRepository.save(group);
  }

  async addUserToGroup(userId: string, groupId: string): Promise<Group> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['users'],
    });

    if (!user || !group) {
      throw new Error('Usuario o grupo no encontrado');
    }

    group.users.push(user);
    return this.groupRepository.save(group);
  }
}
