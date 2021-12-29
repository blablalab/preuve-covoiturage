/* tslint:disable:variable-name*/
import { AbstractControl, FormGroup } from '@angular/forms';
import { BaseModel } from '~/core/entities/BaseModel';
import { Clone } from '~/core/entities/IClone';
import { FormModel } from '~/core/entities/IFormModel';
import { MapModel } from '~/core/entities/IMapModel';
import { assignOrDeleteProperty, removeNullsProperties } from '~/core/entities/utils';
import { TerritoryInterface } from '../../../../../../shared/territory/common/interfaces/TerritoryInterface';
import {
  TerritoryAddress,
  TerritoryBaseInterface,
  TerritoryLevelEnum,
} from '../api/shared/territory/common/interfaces/TerritoryInterface';
import { Address } from '../shared/address';
import { Company } from '../shared/company';
import { CompanyV2 } from '../shared/companyV2';
import { Contact } from '../shared/contact';
import { Contacts, ContactsMapper } from '../shared/contacts';

export interface TerritoryBase extends TerritoryInterface {
  name: string;
  company_id?: number;
  insee?: any;
  contacts?: Contacts;
}

export class TerritoryMapper {
  static toForm(data: TerritoryBaseInterface, fullformMode = true): any {
    return fullformMode
      ? {
          name: data.name ? data.name : '',
          contacts: data.contacts ? data.contacts : undefined,
          address: new Address(data.address).toFormValues(),
          inseeString: '',
        }
      : {
          contacts: data.contacts ? data.contacts : undefined,
        };
  }

  static toModel(
    territoryForm: AbstractControl,
    company_id: number,
    children: number[],
    territoryId?: number,
  ): TerritoryBaseInterface | TerritoryInterface {
    const territory: TerritoryBaseInterface = {
      name: territoryForm.get('name').value,
      company_id: company_id,
      contacts: ContactsMapper.toModel(territoryForm.get('contacts')),
      level: TerritoryLevelEnum.Towngroup,
      address: removeNullsProperties(territoryForm.get('address').value),
      children: children,
    };
    if (territoryId) {
      return {
        _id: territoryId,
        ...territory,
      };
    }
    return territory;
  }
}

export class Territory
  extends BaseModel
  implements TerritoryBaseInterface, FormModel<TerritoryFormModel>, MapModel<Territory>, Clone<Territory>
{
  level: TerritoryLevelEnum;
  name: string;
  company_id?: number;
  company?: CompanyV2;
  children: number[];

  address: TerritoryAddress;
  contacts?: Contacts;
  insee?: string[];

  constructor(base: Territory) {
    super(base);
  }

  clone(): Territory {
    return new Territory(this);
  }

  map(base: TerritoryBase): Territory {
    this.level = base.level as TerritoryLevelEnum;
    this.name = base.name;
    // this.address = base.address;

    assignOrDeleteProperty(base, this, 'contacts', (data) => new Contacts(data.contacts));
    assignOrDeleteProperty(base, this, 'address', (data) => base.address);
    assignOrDeleteProperty(base, this, 'company', (data) => ({ ...data.company }));

    if (base.company_id !== undefined) this.company_id = base.company_id;
    else delete this.company_id;
    if (base._id) this._id = base._id;
    else delete this._id;

    return this;
  }

  updateFromFormValues(formValues: TerritoryFormModel): void {
    this.name = formValues.name;
    this.level = TerritoryLevelEnum.Towngroup;
    this.company_id = formValues.company_id;
    this.children = formValues.children;

    assignOrDeleteProperty(formValues, this, 'contacts', (data) => new Contacts(data.contacts));
    this.address = removeNullsProperties(formValues.address);
  }

  toFormValues(fullformMode = true): any {
    return fullformMode
      ? {
          name: this.name ? this.name : '',
          company: new Company(this.company).toFormValues(),
          contacts: new Contacts(this.contacts).toFormValues(),
          address: new Address(this.address).toFormValues(),
          inseeString: this.insee ? this.insee : '',
        }
      : {
          contacts: new Contacts(this.contacts).toFormValues(),
        };
  }
}

export interface TerritoryFormModel {
  name: string;
  level: string;
  company?: {
    siret: string;
    naf_entreprise: string; // tslint:disable-line variable-name
    nature_juridique: string; // tslint:disable-line variable-name
    rna: string;
    vat_intra: string; // tslint:disable-line variable-name};
  };
  company_id?: number;
  contacts?: { gdpr_dpo: Contact; gdpr_controller: Contact; technical: Contact };
  address?: TerritoryAddress;
  inseeString: string;
  insee?: string[];
  children: number[];
}
