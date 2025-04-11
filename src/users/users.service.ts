import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Buscar o crear un usuario
  async findOrCreate(googleUser: Partial<User>): Promise<User> {
    let user = await this.userRepository.findOne({
      where: [{ google_id: googleUser.google_id }, { email: googleUser.email }],
    });

    if (!user) {
      // Si no existe, crear el usuario
      user = this.userRepository.create(googleUser);
      await this.userRepository.save(user);
    }

    return user;
  }

  // Otros métodos (opcional)
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: id } });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email: email } });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    await this.userRepository.update(id, user);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
