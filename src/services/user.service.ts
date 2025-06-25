import { User } from '../interface/index.interface';
import { KeycloakDAO } from '../dao/keycloak.dao';

export class UserService {
  static createUser(realm: string, user: User) {
    return KeycloakDAO.createUser(realm, user);
  }

  static getUsers(realm: string) {
    return KeycloakDAO.getUsers(realm);
  }

  static updateUser(realm: string, userId: string, user: User) {
    return KeycloakDAO.updateUser(realm, userId, user);
  }

  static deleteUser(realm: string, userId: string) {
    return KeycloakDAO.deleteUser(realm, userId);
  }
}
