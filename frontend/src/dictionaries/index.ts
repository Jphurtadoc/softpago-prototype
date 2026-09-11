import loginEs from './auth/login/es'
import loginEn from './auth/login/en'
import loginPt from './auth/login/pt'
import createAccountEs from './auth/create-account/es'
import createAccountEn from './auth/create-account/en'
import createAccountPt from './auth/create-account/pt'
import forgotPasswordEs from './auth/forgot-password/es'
import forgotPasswordEn from './auth/forgot-password/en'
import forgotPasswordPt from './auth/forgot-password/pt'
import themeEs from './common/theme/es'
import themeEn from './common/theme/en'
import themePt from './common/theme/pt'
import localeEs from './common/locale/es'
import localeEn from './common/locale/en'
import localePt from './common/locale/pt'
import paymentsDashboardEs from './payments/dashboard/es'
import paymentsDashboardEn from './payments/dashboard/en'
import paymentsDashboardPt from './payments/dashboard/pt'
import reportsDashboardEs from './reports/dashboard/es'
import reportsDashboardEn from './reports/dashboard/en'
import reportsDashboardPt from './reports/dashboard/pt'
import loansListEs from './loans/list/es'
import loansListEn from './loans/list/en'
import loansListPt from './loans/list/pt'
import routesListEs from './routes/list/es'
import routesListEn from './routes/list/en'
import routesListPt from './routes/list/pt'
import homeOverviewEs from './home/overview/es'
import homeOverviewEn from './home/overview/en'
import homeOverviewPt from './home/overview/pt'

/**
 * i18next namespaces mirror the folder layout:
 * dictionaries/{feature}/{page}/{locale}.ts → namespace `{feature}/{page}`
 */
export const dictionaryNamespaces = [
  'auth/login',
  'auth/create-account',
  'auth/forgot-password',
  'common/theme',
  'common/locale',
  'payments/dashboard',
  'reports/dashboard',
  'loans/list',
  'routes/list',
  'home/overview',
] as const

export type DictionaryNamespace = (typeof dictionaryNamespaces)[number]

export const dictionaryResources = {
  es: {
    'auth/login': loginEs,
    'auth/create-account': createAccountEs,
    'auth/forgot-password': forgotPasswordEs,
    'common/theme': themeEs,
    'common/locale': localeEs,
    'payments/dashboard': paymentsDashboardEs,
    'reports/dashboard': reportsDashboardEs,
    'loans/list': loansListEs,
    'routes/list': routesListEs,
    'home/overview': homeOverviewEs,
  },
  en: {
    'auth/login': loginEn,
    'auth/create-account': createAccountEn,
    'auth/forgot-password': forgotPasswordEn,
    'common/theme': themeEn,
    'common/locale': localeEn,
    'payments/dashboard': paymentsDashboardEn,
    'reports/dashboard': reportsDashboardEn,
    'loans/list': loansListEn,
    'routes/list': routesListEn,
    'home/overview': homeOverviewEn,
  },
  pt: {
    'auth/login': loginPt,
    'auth/create-account': createAccountPt,
    'auth/forgot-password': forgotPasswordPt,
    'common/theme': themePt,
    'common/locale': localePt,
    'payments/dashboard': paymentsDashboardPt,
    'reports/dashboard': reportsDashboardPt,
    'loans/list': loansListPt,
    'routes/list': routesListPt,
    'home/overview': homeOverviewPt,
  },
} as const

export type AppLocale = keyof typeof dictionaryResources

export const supportedLocales: ReadonlyArray<AppLocale> = ['es', 'en', 'pt']
