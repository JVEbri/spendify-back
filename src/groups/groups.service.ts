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
    // 🔹 1️⃣ Buscar al usuario dueño
    const owner = await this.userRepository.findOne({ where: { id: ownerId } });
    console.log('owner', owner);
    if (!owner) {
      throw new Error('Usuario no encontrado');
    }

    // 🔹 2️⃣ Crear el grupo sin usuarios (solo con el owner)
    let group = this.groupRepository.create({
      name,
      owner, // TypeORM lo guarda automáticamente por la relación @ManyToOne
    });

    // 🔹 3️⃣ Guardar el grupo primero antes de agregar la relación ManyToMany
    group = await this.groupRepository.save(group); // Aseguramos que tenga un ID
    console.log('group', group);
    // 🔹 4️⃣ Ahora sí, añadir el usuario a la tabla intermedia `group_users`
    await this.groupRepository.createQueryBuilder().relation(Group, 'users').of(owner.id).add(group.id);

    return group;
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

  async getGroups(userId: string): Promise<Group[]> {
    const groups = await this.groupRepository.find({
      where: { users: { id: userId } },
      relations: ['owner', 'users'],
    });

    return groups;
  }
}
