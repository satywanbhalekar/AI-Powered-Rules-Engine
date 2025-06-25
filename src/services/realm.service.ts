import { RealmConfig } from '../interface/index.interface';
import { KeycloakDAO } from '../dao/keycloak.dao';

export class RealmService {
  static async createRealm(realm: RealmConfig) {
    return KeycloakDAO.createRealm(realm);
  }
  static async deleteRealm(realmName: string) {
    return KeycloakDAO.deleteRealm(realmName);
  }
  
}
