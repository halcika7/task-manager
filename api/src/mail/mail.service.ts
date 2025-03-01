import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';
import {
  PasswordResetTranslations,
  TaskReminderTranslations,
  WelcomeEmailTranslations,
} from './types/translations.interface';

interface TaskReminderOptions {
  to: string;
  taskTitle: string;
  taskId: string;
  hoursUntilDue: number;
  userName: string;
  locale?: string | null;
}

@Injectable()
export class MailService {
  private readonly appUrl: string;

  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {
    this.appUrl = this.configService.getOrThrow<string>('APP_URL');
  }

  private async getTranslations<T>(
    locale: string,
    translationsPath: string,
  ): Promise<T> {
    try {
      const translationsContent = await readFile(
        join(__dirname, 'translations', translationsPath, `${locale}.json`),
        'utf-8',
      );

      return JSON.parse(translationsContent) as T;
    } catch {
      return this.getTranslations<T>('en', translationsPath);
    }
  }

  async sendTaskReminder({
    to,
    taskTitle,
    taskId,
    hoursUntilDue,
    userName,
    locale,
  }: TaskReminderOptions) {
    const translations = await this.getTranslations<TaskReminderTranslations>(
      locale ?? 'en',
      'task-reminder',
    );

    await this.mailerService.sendMail({
      to,
      subject: translations.subject
        .replace('{{taskTitle}}', taskTitle)
        .replace('{{hoursUntilDue}}', hoursUntilDue.toString()),
      template: 'task-reminder',
      context: {
        taskUrl: `${this.appUrl}/tasks/${taskId}`,
        userName,
        ...translations,
        greeting: translations.greeting.replace('{{userName}}', userName),
        reminder: translations.reminder
          .replace('{{taskTitle}}', taskTitle)
          .replace('{{hoursUntilDue}}', hoursUntilDue.toString()),
      },
    });
  }

  async sendWelcomeEmail(
    to: string,
    name: string,
    password?: string,
    locale = 'en',
  ) {
    const translations = await this.getTranslations<WelcomeEmailTranslations>(
      locale,
      'welcome',
    );

    await this.mailerService.sendMail({
      to,
      subject: translations.welcomeHeader,
      template: 'welcome',
      context: {
        name,
        appUrl: this.appUrl,
        password,
        t: translations,
        locale,
      },
    });
  }

  async sendPasswordResetEmail(
    to: string,
    resetToken: string,
    name: string,
    locale = 'en',
  ) {
    const translations = await this.getTranslations<PasswordResetTranslations>(
      locale,
      'password-reset',
    );

    await this.mailerService.sendMail({
      to,
      subject: translations.subject,
      template: 'password-reset',
      context: {
        resetUrl: `${this.appUrl}/${locale}/auth/reset-password?token=${resetToken}`,
        userName: name,
        t: translations,
      },
    });
  }
}
