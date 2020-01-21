import { CampaignStatusEnum } from '~/core/enums/campaign/campaign-status.enum';
import { UserGroupEnum } from '~/core/enums/user/user-group.enum';

import { stubCampaignList } from '../support/stubs/campaign/campaign.list';
import { stubStatList } from '../support/stubs/stat/stat.list';
import { stubTripList } from '../support/stubs/trip/trip.list';
import { stubOperatorList } from '../support/stubs/operator/operator.list';
import { stubUserMe } from '../support/stubs/user/user.me';
import { stubTerritoryList } from '../support/stubs/territory/territory.list';
import { TripGenerator } from '../support/generators/trips.generator';
import { stubLogout } from '../support/stubs/auth/logout';
import { stubUserPatch } from '../support/stubs/user/user.patch';
import { stubMainLists } from '../support/stubs/loadMainLists';
import { testOperatorStory } from '../support/stories/operator.story';
import { stubLogin } from '../support/stubs/auth/login';
import { stubOperatorPatchContacts } from '../support/stubs/operator/operator.patchContacts';
import { testRegistryStory } from '../support/stories/registry.story';
import { stubCampaignTemplateList } from '../support/stubs/campaign/campaign-template.list';
import { stubCampaignCreate } from '../support/stubs/campaign/campaign.create';
import { stubCampaignPatch } from '../support/stubs/campaign/campaign.patch';
import { stubCampaignLaunch } from '../support/stubs/campaign/campaign.launched';
import { stubTerritoryPatchContacts } from '../support/stubs/territory/territory.patchContacts';
import { testTerritoryStory } from '../support/stories/territory.story';
import { stubUserList } from '../support/stubs/user/user.list';
import { UserGenerator } from '../support/generators/user.generator';
import { stubApplications } from '../support/stubs/operator/application/application.list';
import { ApplicationsGenerator } from '../support/generators/applications.generator';
import { stubApplicationCreate } from '../support/stubs/operator/application/application.create';
import { stubApplicationRevoke } from '../support/stubs/operator/application/application.revoke';
import { cypress_login } from '../support/reusables/auth/cypress_login';
import { stubApiAdress } from '../support/stubs/external/api-adresse';
import { stubVisibilityList } from '../support/stubs/territory/territory.listOperator';
import { stubVisibilityUpdate } from '../support/stubs/territory/territory.updateOperator';
import { stubTripExport } from '../support/stubs/trip/trip.export';
import { DEBUG_CONFIG } from '../config/debug.config';
import { CI_CONFIG } from '../config/ci.config';

const isLocal = Cypress.env('ENV_NAME') && Cypress.env('ENV_NAME') === 'local';

const config = isLocal ? DEBUG_CONFIG.integration : CI_CONFIG.integration;

context('REGISTRY', () => {
  if (!('registry' in config)) {
    return;
  }
  const users = UserGenerator.generateList(UserGroupEnum.REGISTRY);
  const trips = TripGenerator.generateTrips();

  describe('login', () => {
    cypress_login({
      email: 'territory@example.com',
      password: 'admin1234',
      group: UserGroupEnum.REGISTRY,
    });
  });

  describe('registry dashboard', () => {
    beforeEach(() => {
      cy.server();
      stubCampaignList();
      stubOperatorList();
      stubTerritoryList();
      stubTripList(trips);
      stubStatList();
      stubMainLists(UserGroupEnum.REGISTRY);
      stubLogin(UserGroupEnum.REGISTRY);
      stubUserMe(UserGroupEnum.REGISTRY);
      stubUserPatch(UserGroupEnum.REGISTRY);
      stubLogout();
      stubUserList(users);
    });

    // run tests
    testRegistryStory(config.registry);
  });
});
