export interface Condition {
    field: string;
    operator: string;
    value: any;
  }
  
  export interface Action {
    params: any;
    type: 'CALCULATION' | 'NOTIFICATION' | 'TAGGING';
    value: any;
    field?: string; // for calculations
  }
  
  export interface Rule {
    id?: string;
    name: string;
    description?: string;
    conditions: Condition[];
    actions: Action[];
    is_Active: boolean;
    tenant_Id: string;
  }
  