import { USER_GROUPS, Groups } from '~/core/enums/user/groups';
import { Roles } from '~/core/enums/user/roles';
import { ProfileInterface } from '~/core/interfaces/user/profileInterface';
import { BaseUser, User } from '~/core/entities/authentication/user';

import { cypress_logging_users } from '../stubs/auth/login';
import { territoryStub } from '../stubs/territory/territory.find';
import { operatorStub } from '../stubs/operator/operator.find';
import { FIRSTNAMES } from './const/firstnames.const';
import { LASTNAMES } from './const/lastnames.const';

export class UserGenerator {
  static numberOfUsers = 50;

  static generateUser(profilData: ProfileInterface, group: Groups, id: number): BaseUser {
    switch (group) {
      case Groups.Territory:
        return {
          _id: id,
          ...profilData,
          role: Roles.TerritoryAdmin,
          group: Groups.Territory,
          territory_id: territoryStub._id,
        };
      case Groups.Operator:
        return {
          _id: id,
          ...profilData,
          role: Roles.OperatorAdmin,
          group: Groups.Operator,
          operator_id: operatorStub._id,
        };
      case Groups.Registry:
        return {
          _id: id,
          ...profilData,
          role: Roles.RegistryAdmin,
          group: Groups.Registry,
        };
    }
  }

  static generateList(group: Groups) {
    const list = [];

    list.push(cypress_logging_users[group]);

    for (let i = 0; i < UserGenerator.numberOfUsers - 1; i += 1) {
      const firstname = FIRSTNAMES[Math.floor(Math.random() * FIRSTNAMES.length)];
      const lastname = LASTNAMES[Math.floor(Math.random() * FIRSTNAMES.length)];
      const profilData: ProfileInterface = {
        firstname,
        lastname,
        email: `${firstname}.${lastname}@yopmail.com`,
        phone: `07${Math.floor(Math.random() * 10000000)}`,
      };
      const grp = USER_GROUPS[Math.floor(Math.random() * 3)];
      list.push(UserGenerator.generateUser(profilData, grp, i + 10));
    }

    return list;
  }
}
