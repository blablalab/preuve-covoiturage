import { userGroupRole, UserRoleEnum } from '~/core/enums/user/user-role.enum';
import { UserGroupEnum } from '~/core/enums/user/user-group.enum';
import { UserInterface, UserPermissionsType } from '~/core/interfaces/user/profileInterface';

import { IModel } from '../IModel';
import { IFormModel } from '~/core/entities/IFormModel';
import { IMapModel } from '~/core/entities/IMapModel';
import { IClone } from '~/core/entities/IClone';

export class BaseUser implements IModel {
  public _id: number;
  public email: string;
  public lastname: string;
  public firstname: string;
  public phone: string;
  public status?: string;
  public group: UserGroupEnum;
  public role: UserRoleEnum;

  // tslint:disable-next-line:variable-name
  public operator_id?: number;
  // tslint:disable-next-line:variable-name
  public territory_id?: number;
}

export class User extends BaseUser implements IFormModel<any>, IMapModel<User, UserInterface>, IClone<User> {
  public permissions: UserPermissionsType;

  // todo: don't set default user
  constructor(obj?: UserInterface) {
    super();
    this.map({
      _id: null,
      email: null,
      lastname: null,
      firstname: null,
      phone: null,
      group: null,
      role: null,
      permissions: [],
      ...obj,
    });
  }

  map(obj: UserInterface): User {
    this._id = obj._id;
    this.email = obj.email;
    this.lastname = obj.lastname;
    this.firstname = obj.firstname;
    this.phone = obj.phone;
    this.group = obj.group;
    this.role = obj.role;
    this.permissions = obj.permissions;

    if (obj.operator_id) {
      this.operator_id = obj.operator_id;
    }
    if (obj.territory_id) {
      this.territory_id = obj.territory_id;
    }

    return this;
  }

  toFormValues(): any {
    return {
      firstname: this.firstname ? this.firstname : '',
      lastname: this.lastname ? this.lastname : '',
      email: this.email ? this.email : '',
      phone: this.phone ? this.phone : '',
      role: this.role ? this.role.split('.').pop() : '',
      group: this.group,
      territory_id: this.territory_id ? this.territory_id : null,
      operator_id: this.operator_id ? this.operator_id : null,
    };
  }

  updateFromFormValues(formVal: any): void {
    this.map(formVal);

    this.email = formVal.email;
    this.lastname = formVal.lastname;
    this.firstname = formVal.firstname;

    formVal.phone = formVal.phone ? formVal.phone : null;

    if (this._id) {
      delete this.territory_id;
      delete this.operator_id;
      delete this.group;
      delete this.role;
    } else {
      if (formVal.territory_id) this.email = formVal.email;
      else delete this.territory_id;
      if (formVal.operator_id) this.operator_id = formVal.operator_id;
      else delete this.operator_id;

      this.role = <UserRoleEnum>`${userGroupRole[formVal.group]}.${formVal.role}`; // consolidate final role
    }

    delete formVal.group;
  }

  clone(): User {
    return new User(this);
  }
}
