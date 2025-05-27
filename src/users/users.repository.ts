import { User } from './users.entity';
import { DataSource, Repository } from 'typeorm';

export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findByIdWithGroups(userId: string) {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.groups', 'group')
      .select(['user.id', 'user.name', 'user.email', 'group.id', 'group.name'])
      .where('user.id = :userId', { userId })
      .getOne();
  }
}
