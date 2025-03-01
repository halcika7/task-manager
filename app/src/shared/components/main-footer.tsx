import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { LocaleLink } from '@/modules/i18n/routing';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

export default function MainFooter() {
  const t = useTranslations('main.footer');
  return (
    <footer className="border-border bg-background relative w-full border-t">
      <div className="relative z-10 mx-auto w-full px-4 py-20">
        {/* Grid Layout */}
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:gap-16">
          {/* Brand Section */}
          <div className="text-foreground col-span-2 space-y-4 md:col-span-1">
            <h4 className="text-foreground text-2xl font-bold">TaskFlow</h4>
            <p className="text-muted-foreground">{t('description')}</p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/taskflow"
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://github.com/taskflow"
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/company/taskflow"
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="mailto:contact@taskflow.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-foreground font-semibold">
              {t('product.title')}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <LocaleLink
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('product.features')}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('product.pricing')}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('product.integrations')}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('product.changelog')}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('product.docs')}
                </LocaleLink>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="text-foreground font-semibold">
              {t('company.title')}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <LocaleLink
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('company.about')}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('company.blog')}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('company.careers')}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('company.customers')}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('company.brand')}
                </LocaleLink>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-4">
            <h4 className="text-foreground font-semibold">
              {t('resources.title')}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <LocaleLink
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('resources.community')}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('resources.contact')}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('resources.dpa')}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('resources.privacy')}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('resources.terms')}
                </LocaleLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-border mt-16 border-t pt-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <h5 className="text-foreground text-lg font-semibold">
                {t('newsletter.title')}
              </h5>
              <p className="text-muted-foreground mt-1 text-sm">
                {t('newsletter.description')}
              </p>
            </div>
            <div className="flex w-full items-center gap-2 md:w-auto">
              <Input
                type="email"
                placeholder={t('newsletter.placeholder')}
                className="max-w-sm"
                autoComplete="email"
              />
              <Button>{t('newsletter.subscribe')}</Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-border mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row md:text-start">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {t('copyright.description')}
          </p>
          <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-sm md:justify-end">
            <LocaleLink
              href="/"
              className="hover:text-foreground transition-colors"
            >
              {t('copyright.links.privacy')}
            </LocaleLink>
            <LocaleLink
              href="/"
              className="hover:text-foreground transition-colors"
            >
              {t('copyright.links.terms')}
            </LocaleLink>
            <LocaleLink
              href="/"
              className="hover:text-foreground transition-colors"
            >
              {t('copyright.links.cookies')}
            </LocaleLink>
            <LocaleLink
              href="/"
              className="hover:text-foreground transition-colors"
            >
              {t('copyright.links.sitemap')}
            </LocaleLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
