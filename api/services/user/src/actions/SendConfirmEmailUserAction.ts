import { sprintf } from 'sprintf-js';
import { Action as AbstractAction } from '@ilos/core';
import { handler, ContextType, ConfigInterfaceResolver, KernelInterfaceResolver } from '@ilos/common';
import { CryptoProviderInterfaceResolver } from '@pdc/provider-crypto';

import { UserRepositoryProviderInterfaceResolver } from '../interfaces/UserRepositoryProviderInterface';

/*
 * send the confirmation email to a user by _id
 */
@handler({
  service: 'user',
  method: 'sendConfirmEmail',
})
export class SendConfirmEmailUserAction extends AbstractAction {
  public readonly middlewares: (string | [string, any])[] = [
    ['validate', 'user.sendConfirmEmail'],
    ['can', ['user.send-confirm-email']],
  ];

  constructor(
    private userRepository: UserRepositoryProviderInterfaceResolver,
    private cryptoProvider: CryptoProviderInterfaceResolver,
    private config: ConfigInterfaceResolver,
    private kernel: KernelInterfaceResolver,
  ) {
    super();
  }

  public async handle(params: { _id: string }, context: ContextType): Promise<void> {
    const user = await this.userRepository.find(params._id);

    // generate a token and store in the user
    const token = this.cryptoProvider.generateToken();
    await this.userRepository.patch(user._id, {
      forgotten_token: await this.cryptoProvider.cryptToken(token),
      forgotten_at: new Date(),
      status: 'pending',
    });

    const link = sprintf(
      '%s/confirm-email/%s/%s/',
      this.config.get('url.appUrl'),
      encodeURIComponent(user.email),
      encodeURIComponent(token),
    );

    // debug data for testing
    // if (process.env.NODE_ENV === 'testing') {
    console.log(`
******************************************
[test] Send confirm email to user (${user._id.toString()})
email: ${user.email}
token: ${token}
link:  ${link}
******************************************
                `);
    // }

    await this.kernel.call(
      'user:notify',
      {
        link,
        template: this.config.get('email.templates.confirmation'),
        email: user.email,
        fullname: user.fullname,
      },
      {
        call: context.call,
        channel: {
          ...context.channel,
          service: 'user',
        },
      },
    );
  }
}
