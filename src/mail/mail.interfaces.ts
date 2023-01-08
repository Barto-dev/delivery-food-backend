export interface MailModuleOptions {
  apiKey: string;
  domain: string;
  fromEmail: string;
}

export const enum EmailVarsKeys {
  CODE = 'code',
  USERNAME = 'username',
}

export interface EmailVars {
  key: EmailVarsKeys;
  value: string;
}

export const enum MailTemplates {
  VERIFICATION = 'email-confirmation',
}
