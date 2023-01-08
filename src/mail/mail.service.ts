import got from 'got';
import * as FormData from 'form-data';
import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from '../common/common.contstants';
import {
  EmailVars,
  EmailVarsKeys,
  MailModuleOptions,
  MailTemplates,
} from './mail.interfaces';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  private async sendEmail(
    subject: string,
    template: MailTemplates,
    emailVars?: EmailVars[],
  ) {
    const form = new FormData();
    form.append('from', `Excited User <me@${this.options.domain}>`);
    form.append('to', process.env.TEST_EMAIL);
    form.append('subject', subject);
    form.append('template', template);
    emailVars.forEach((emailVar) => {
      if (emailVar) {
        form.append(`v:${emailVar.key}`, emailVar.value);
      }
    });
    const options = {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `api:${this.options.apiKey}`,
        ).toString('base64')}`,
      },
      body: form,
    };
    try {
      await got.post(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        options,
      );
    } catch (err) {
      console.log(err);
    }
  }

  sendVerificationEmail(email: string, code: string) {
    const emailVars = [
      {
        key: EmailVarsKeys.CODE,
        value: code,
      },
      {
        key: EmailVarsKeys.USERNAME,
        value: email,
      },
    ];
    this.sendEmail('Verify Your Email', MailTemplates.VERIFICATION, emailVars);
  }
}
