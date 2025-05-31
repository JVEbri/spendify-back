// src/groups/groups.repository.ts

import { Group } from './groups.entity';
import { User } from '../users/users.entity';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupsRepository extends Repository<Group> {
  constructor(private dataSource: DataSource) {
    super(Group, dataSource.createEntityManager());
  }

  async addUserToGroup(groupId: string, user: User): Promise<Group> {
    // Asegurarte de que existe el grupo
    const group = await this.findOne({ where: { id: groupId } });
    if (!group) throw new Error('Grupo no encontrado');

    // Usa QueryBuilder para agregar al usuario a la relación ManyToMany
    await this.createQueryBuilder()
      .relation(User, 'groups')
      .of(user.id) // <- Importante: aquí va el GROUP
      .add(group.id); // <- Aquí va el USER

    // Devuelve el grupo actualizado si quieres
    return this.findOne({
      where: { id: groupId },
      relations: ['users'],
    });
  }

  async getGroupsForUser(userId: string): Promise<Group[]> {
    return this.createQueryBuilder('group')
      .leftJoinAndSelect('group.users', 'user')
      .leftJoinAndSelect('group.owner', 'owner')
      .where('user.id = :userId', { userId })
      .getMany();
  }
}
