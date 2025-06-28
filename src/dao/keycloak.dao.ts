import axios from 'axios';
import { getAdminToken } from '../utils/keycloak';
import { RealmConfig, User } from '../interface/index.interface';
import  config  from '../config/env';

export class KeycloakDAO {
  static async createRealm(realmData: RealmConfig) {
    const token = await getAdminToken();

    const response = await axios.post(
      `${config.keycloak.baseUrl}/admin/realms`,
      realmData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  }
  static async getAllRealms() {
    const token = await getAdminToken();
  
    const response = await axios.get(
      `${config.keycloak.baseUrl}/admin/realms`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  
    return response.data;
  }
  
  static async deleteRealm(realmName: string) {
    const token = await getAdminToken();
  
    const response = await axios.delete(
      `${config.keycloak.baseUrl}/admin/realms/${realmName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    return response.data;
  }
// CREATE
static async createUser(realm: string, user: User) {
    const token = await getAdminToken();
    const response = await axios.post(
      `${config.keycloak.baseUrl}/admin/realms/${realm}/users`,
      user,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
  
  // READ (list all users)
  static async getUsers(realm: string) {
    const token = await getAdminToken();
    const response = await axios.get(
      `${config.keycloak.baseUrl}/admin/realms/${realm}/users`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
  
  // UPDATE
  static async updateUser(realm: string, userId: string, user: User) {
    const token = await getAdminToken();
    const response = await axios.put(
      `${config.keycloak.baseUrl}/admin/realms/${realm}/users/${userId}`,
      user,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
  
  // DELETE
  static async deleteUser(realm: string, userId: string) {
    const token = await getAdminToken();
    const response = await axios.delete(
      `${config.keycloak.baseUrl}/admin/realms/${realm}/users/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
  
}

