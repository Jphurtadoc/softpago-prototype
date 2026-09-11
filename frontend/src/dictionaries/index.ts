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
import sidebarEs from './common/sidebar/es'
import sidebarEn from './common/sidebar/en'
import sidebarPt from './common/sidebar/pt'
import navEs from './common/nav/es'
import navEn from './common/nav/en'
import navPt from './common/nav/pt'
import paymentsDashboardEs from './payments/dashboard/es'
import paymentsDashboardEn from './payments/dashboard/en'
import paymentsDashboardPt from './payments/dashboard/pt'
import reportsDashboardEs from './reports/dashboard/es'
import reportsDashboardEn from './reports/dashboard/en'
import reportsDashboardPt from './reports/dashboard/pt'
import loansListEs from './loans/list/es'
import loansListEn from './loans/list/en'
import loansListPt from './loans/list/pt'
import loansDetailsEs from './loans/details/es'
import loansDetailsEn from './loans/details/en'
import loansDetailsPt from './loans/details/pt'
import loansEditEs from './loans/edit/es'
import loansEditEn from './loans/edit/en'
import loansEditPt from './loans/edit/pt'
import routesListEs from './routes/list/es'
import routesListEn from './routes/list/en'
import routesListPt from './routes/list/pt'
import routesDetailsEs from './routes/details/es'
import routesDetailsEn from './routes/details/en'
import routesDetailsPt from './routes/details/pt'
import routesEditEs from './routes/edit/es'
import routesEditEn from './routes/edit/en'
import routesEditPt from './routes/edit/pt'
import homeOverviewEs from './home/overview/es'
import homeOverviewEn from './home/overview/en'
import homeOverviewPt from './home/overview/pt'
import settingsPageEs from './settings/page/es'
import settingsPageEn from './settings/page/en'
import settingsPagePt from './settings/page/pt'

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
  'common/sidebar',
  'common/nav',
  'payments/dashboard',
  'reports/dashboard',
  'loans/list',
  'loans/details',
  'loans/edit',
  'routes/list',
  'routes/details',
  'routes/edit',
  'home/overview',
  'settings/page',
] as const

export type DictionaryNamespace = (typeof dictionaryNamespaces)[number]

export const dictionaryResources = {
  es: {
    'auth/login': loginEs,
    'auth/create-account': createAccountEs,
    'auth/forgot-password': forgotPasswordEs,
    'common/theme': themeEs,
    'common/locale': localeEs,
    'common/sidebar': sidebarEs,
    'common/nav': navEs,
    'payments/dashboard': paymentsDashboardEs,
    'reports/dashboard': reportsDashboardEs,
    'loans/list': loansListEs,
    'loans/details': loansDetailsEs,
    'loans/edit': loansEditEs,
    'routes/list': routesListEs,
    'routes/details': routesDetailsEs,
    'routes/edit': routesEditEs,
    'home/overview': homeOverviewEs,
    'settings/page': settingsPageEs,
  },
  en: {
    'auth/login': loginEn,
    'auth/create-account': createAccountEn,
    'auth/forgot-password': forgotPasswordEn,
    'common/theme': themeEn,
    'common/locale': localeEn,
    'common/sidebar': sidebarEn,
    'common/nav': navEn,
    'payments/dashboard': paymentsDashboardEn,
    'reports/dashboard': reportsDashboardEn,
    'loans/list': loansListEn,
    'loans/details': loansDetailsEn,
    'loans/edit': loansEditEn,
    'routes/list': routesListEn,
    'routes/details': routesDetailsEn,
    'routes/edit': routesEditEn,
    'home/overview': homeOverviewEn,
    'settings/page': settingsPageEn,
  },
  pt: {
    'auth/login': loginPt,
    'auth/create-account': createAccountPt,
    'auth/forgot-password': forgotPasswordPt,
    'common/theme': themePt,
    'common/locale': localePt,
    'common/sidebar': sidebarPt,
    'common/nav': navPt,
    'payments/dashboard': paymentsDashboardPt,
    'reports/dashboard': reportsDashboardPt,
    'loans/list': loansListPt,
    'loans/details': loansDetailsPt,
    'loans/edit': loansEditPt,
    'routes/list': routesListPt,
    'routes/details': routesDetailsPt,
    'routes/edit': routesEditPt,
    'home/overview': homeOverviewPt,
    'settings/page': settingsPagePt,
  },
} as const

export type AppLocale = keyof typeof dictionaryResources

export const supportedLocales: ReadonlyArray<AppLocale> = ['es', 'en', 'pt']
