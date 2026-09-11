import { useEffect } from 'react'
import { Outlet, useMatches } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import type { DictionaryNamespace } from '@/dictionaries'

const DEFAULT_DOCUMENT_TITLE = 'SoftPago | Software de cobranza'
const DOCUMENT_TITLE_BRAND = 'SoftPago'

/**
 * Route handle used to set the browser tab title.
 */
export interface DocumentTitleHandle {
  /** i18next namespace that owns the page name. */
  readonly documentTitleNs?: DictionaryNamespace
  /** Key inside the namespace. Defaults to `title`. */
  readonly documentTitleKey?: string
}

/**
 * Builds the document title for a named page, or the marketing default.
 */
export function buildDocumentTitle(pageName: string | undefined): string {
  if (!pageName) {
    return DEFAULT_DOCUMENT_TITLE
  }
  return `${pageName} | ${DOCUMENT_TITLE_BRAND}`
}

function readDocumentTitleHandle(
  handle: unknown,
): DocumentTitleHandle | undefined {
  if (handle == null || typeof handle !== 'object') {
    return undefined
  }
  return handle as DocumentTitleHandle
}

/**
 * Root layout that syncs `document.title` with the deepest matched route.
 */
export function DocumentTitleOutlet() {
  const matches = useMatches()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const match = [...matches].reverse().find((item) => {
      const handle = readDocumentTitleHandle(item.handle)
      return Boolean(handle?.documentTitleNs)
    })
    const handle = readDocumentTitleHandle(match?.handle)
    const titleKey = handle?.documentTitleKey ?? 'title'
    if (
      !handle?.documentTitleNs ||
      !i18n.exists(titleKey, { ns: handle.documentTitleNs })
    ) {
      document.title = buildDocumentTitle(undefined)
      return
    }
    const pageName = t(titleKey, { ns: handle.documentTitleNs })
    document.title = buildDocumentTitle(pageName)
  }, [matches, t, i18n.language])

  return <Outlet />
}
