import path from 'path';
import { ServiceProvider as AbstractServiceProvider } from '@ilos/core';
import { serviceProvider, NewableType, ExtensionInterface } from '@ilos/common';
import { PermissionMiddleware } from '@ilos/package-acl';
import { MongoConnection } from '@ilos/connection-mongo';
import { ValidatorExtension, ValidatorMiddleware } from '@pdc/provider-validator';
import { CryptoProvider } from '@pdc/provider-crypto';
import {
  ScopeToSelfMiddleware,
  ContentBlacklistMiddleware,
  ContentWhitelistMiddleware,
} from '@pdc/provider-middleware';
import {
  userChangePasswordSchema,
  userChangePasswordWithTokenSchema,
  userChangeRoleSchema,
  userCheckForgottenTokenSchema,
  userConfirmEmailSchema,
  userCreateSchema,
  userDeleteSchema,
  userFindSchema,
  userForgottenPasswordSchema,
  userListSchema,
  userLoginSchema,
  userPatchSchema,
  userRegisterSchema,
  userResetPasswordSchema,
} from '@pdc/provider-schema';

import {
  MeUserAction,
  CreateUserAction,
  DeleteUserAction,
  FindUserAction,
  NotifyUserAction,
  ListUserAction,
  PatchUserAction,
  ConfirmEmailUserAction,
  ForgottenPasswordUserAction,
  ResetPasswordUserAction,
  ChangePasswordUserAction,
  LoginUserAction,
  ChangeRoleUserAction,
  RegisterUserAction,
  SchemaUserAction,
  ChangePasswordWithTokenUserAction,
  CheckForgottenTokenUserAction,
} from './actions';
import { UserRepositoryProvider } from './providers/UserRepositoryProvider';
import { ForgottenTokenValidatorProvider } from './providers/ForgottenTokenValidatorProvider';

@serviceProvider({
  config: __dirname,
  providers: [UserRepositoryProvider, CryptoProvider, ForgottenTokenValidatorProvider],
  validator: [
    ['user.changePassword', userChangePasswordSchema],
    ['user.changePasswordWithToken', userChangePasswordWithTokenSchema],
    ['user.changeRole', userChangeRoleSchema],
    ['user.checkForgottenToken', userCheckForgottenTokenSchema],
    ['user.confirmEmail', userConfirmEmailSchema],
    ['user.create', userCreateSchema],
    ['user.delete', userDeleteSchema],
    ['user.find', userFindSchema],
    ['user.forgottenPassword', userForgottenPasswordSchema],
    ['user.list', userListSchema],
    ['user.login', userLoginSchema],
    ['user.patch', userPatchSchema],
    ['user.register', userRegisterSchema],
    ['user.resetPassword', userResetPasswordSchema],
  ],
  middlewares: [
    ['can', PermissionMiddleware],
    ['validate', ValidatorMiddleware],
    ['scopeIt', ScopeToSelfMiddleware],
    ['content.blacklist', ContentBlacklistMiddleware],
    ['content.whitelist', ContentWhitelistMiddleware],
  ],
  connections: [[MongoConnection, 'mongo']],
  handlers: [
    ChangePasswordUserAction,
    ChangePasswordWithTokenUserAction,
    ChangeRoleUserAction,
    CheckForgottenTokenUserAction,
    ConfirmEmailUserAction,
    CreateUserAction,
    DeleteUserAction,
    FindUserAction,
    ForgottenPasswordUserAction,
    ListUserAction,
    LoginUserAction,
    MeUserAction,
    NotifyUserAction,
    PatchUserAction,
    RegisterUserAction,
    ResetPasswordUserAction,
    SchemaUserAction,
  ],
  template: null,
  notification: {
    template: path.resolve(__dirname, 'templates'),
    templateMeta: 'template',
  },
})
export class ServiceProvider extends AbstractServiceProvider {
  readonly extensions: NewableType<ExtensionInterface>[] = [ValidatorExtension];
}
