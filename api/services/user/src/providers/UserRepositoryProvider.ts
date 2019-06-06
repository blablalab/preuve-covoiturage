import { Providers, Container, Exceptions } from '@pdc/core';
import { ParentRepositoryProvider } from '@pdc/provider-repository';
import { MongoException, MongoProvider, ObjectId } from '@pdc/provider-mongo';

import { userSchema } from '../entities/userSchema';
import { User } from '../entities/User';
import { UserRepositoryProviderInterface } from '../interfaces/UserRepositoryProviderInterface';
import { UserDbInterface } from '../interfaces/UserInterfaces';

@Container.provider()
export class UserRepositoryProvider extends ParentRepositoryProvider implements UserRepositoryProviderInterface{
  constructor(
    protected config: Providers.ConfigProvider,
    protected mongoProvider: MongoProvider,
  ) {
    super(config, mongoProvider);
  }

  public getKey(): string {
    return this.config.get('user.collectionName');
  }

  public getDatabase(): string {
    return this.config.get('mongo.db');
  }

  public getSchema(): object | null {
    return userSchema;
  }

  public getModel() {
    return User;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const collection = await this.getCollection();
    const result = await collection.findOne({ email });
    return result ? this.instanciate(result) : result;
  }

  public async list(filters, pagination): Promise<{users: UserDbInterface[], total: number}> {
    let result = [];

    const collection = await this.getCollection();

    const normalizedFilters = this.normalizeContextFilters(filters);

    const skip = 'skip' in filters ? filters.skip : this.config.get('user.defaultSkip');
    const limit = 'limit' in filters ? filters.limit : this.config.get('user.defaultLimit');

    result = await collection.find(normalizedFilters).skip(skip).limit(limit).toArray();

    const users = this.instanciateMany(result);
    const total = await this.countUsers(normalizedFilters);

    return {
      users,
      total,
    };
  }

  public async deleteUser(id: string, contextParam: {aom?: string, operator?: string}):Promise<void> {
    const normalizedFilters = this.normalizeContextFilters(contextParam);
    const collection = await this.getCollection();
    const normalizedId = new ObjectId(id);
    const result = await collection.deleteOne({ _id: id, ...normalizedFilters });
    if (result.deletedCount !== 1) {
      throw new MongoException();
    }
    return;
  }

  public async findUser(id: string, contextParam: {aom?: string, operator?: string}): Promise<UserDbInterface> {
    const normalizedFilters = this.normalizeContextFilters(contextParam);
    const collection = await this.getCollection();
    const normalizedId = new ObjectId(id);
    const result = await collection.findOne({ _id: normalizedId, ...normalizedFilters });
    if (!result) throw new Exceptions.NotFoundException('id not found');
    return this.instanciate(result);
  }

  public async patchUser(id: string, patch: any, contextParam: {aom?: string, operator?: string}) {
    const normalizedFilters = this.normalizeContextFilters(contextParam);
    const collection = await this.getCollection();
    const normalizedId = new ObjectId(id);
    const result = await collection.findOneAndUpdate(
      { _id: normalizedId },
      {
        $set: patch,
      },
      {
        returnOriginal: false,
      },
    );
    if (result.ok !== 1) {
      throw new MongoException();
    }
    return this.instanciate(result.value);
  }

  private normalizeContextFilters(contextFilter: {aom?: string, operator?: string}) {
    const normalizedFilters: { aom?: ObjectId, operator?: ObjectId} = {};
    if ('aom' in contextFilter) {
      normalizedFilters.aom = new ObjectId(contextFilter.aom);
    }
    if ('operator' in contextFilter) {
      normalizedFilters.operator = new ObjectId(contextFilter.operator);
    }
    return normalizedFilters;
  }

  private async countUsers(filters: {aom?: ObjectId, operator?: ObjectId}) {
    const collection = await this.getCollection();
    return collection.countDocuments(filters);
  }
}
