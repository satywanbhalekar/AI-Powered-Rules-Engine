// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RealmConfig } from '../interface/index.interface';
import { KeycloakDAO } from '../dao/keycloak.dao';

import { TenantTemplateDAO } from '../dao/tenantTemplate.dao';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { v4 as uuidv4 } from 'uuid';



export class RealmService {
  // static async createRealm(realm: RealmConfig) {
  //   return KeycloakDAO.createRealm(realm);
  // }


    static generateRandomPassword(length: number): string {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
      return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }
  
    static async createRealm({
      tenantName,
      email,
      lastName,
      firstName,
      role
    }: {
      tenantName: string;
      email: string;
      lastName: string;
      firstName: string;
      role: string;
    }) {
      const templates = await TenantTemplateDAO.getAllTemplates();
    
      const template = templates[0].template; // fixed this line
      console.log('[debug] raw template JSON:', JSON.stringify(template, null, 2));
    
      const randomPassword = this.generateRandomPassword(12);
      const timestamp = new Date().toISOString();
    
      // Convert template object to string
      let modifiedTemplate = JSON.stringify(template);
    
      // Replace placeholders
      modifiedTemplate = modifiedTemplate
        .replace(/unique_tenant_name/g, tenantName)
        .replace(/unique_user_email/g, email)
        .replace(/unique_user_lastname/g, lastName)
        .replace(/unique_user_firstname/g, firstName)
        .replace(/unique_user_password/g, randomPassword)
        .replace(/unique_user_role/g, role)
        .replace(/timestamp/g, timestamp);
    
      // Parse back to JSON
      const parsedRealmPayload = JSON.parse(modifiedTemplate);
    
      // Call Keycloak to create realm
      await KeycloakDAO.createRealm(parsedRealmPayload);
    
      return {
        tenantName,
        email,
        firstName,
        lastName,
        role,
        password: randomPassword
      };
    }
    
  
  

  static async getAllRealms() {
    return KeycloakDAO.getAllRealms();
  }
  
  static async deleteRealm(realmName: string) {
    return KeycloakDAO.deleteRealm(realmName);
  }
  
}
