export interface RealmConfig {
  id: string;
  realm: string;
  enabled: boolean;
  [key: string]: any;
}
export interface User {
  id?: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  enabled: boolean;
  emailVerified?: boolean;
  realmRoles?: string[];
  access?: Record<string, boolean>;
  createdTimestamp?: number;
}

