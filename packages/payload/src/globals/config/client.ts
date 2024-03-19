import type {
  LivePreviewConfig,
  SanitizedConfig,
  ServerOnlyLivePreviewProperties,
} from '../../config/types.js'
import type { ClientFieldConfig } from '../../fields/config/client.js'
import type { SanitizedGlobalConfig } from './types.js'

import { createClientFieldConfigs } from '../../fields/config/client.js'

export type ServerOnlyGlobalProperties = keyof Pick<
  SanitizedGlobalConfig,
  'access' | 'admin' | 'endpoints' | 'fields' | 'hooks'
>
export type ServerOnlyGlobalAdminProperties = keyof Pick<
  SanitizedGlobalConfig['admin'],
  'components' | 'hidden' | 'preview'
>

export type ClientGlobalConfig = Omit<
  SanitizedGlobalConfig,
  'admin' | 'fields' | ServerOnlyGlobalProperties
> & {
  admin: Omit<
    SanitizedGlobalConfig['admin'],
    ServerOnlyGlobalAdminProperties & 'fields' & 'livePreview'
  > & {
    livePreview?: Omit<LivePreviewConfig, ServerOnlyLivePreviewProperties>
  }
  fields: ClientFieldConfig[]
}

export const createClientGlobalConfig = (
  global: SanitizedConfig['globals'][0],
): ClientGlobalConfig => {
  const sanitized = { ...global }
  sanitized.fields = createClientFieldConfigs(sanitized.fields)

  const serverOnlyProperties: Partial<ServerOnlyGlobalProperties>[] = [
    'hooks',
    'access',
    'endpoints',
    // `admin` is handled separately
  ]

  serverOnlyProperties.forEach((key) => {
    if (key in sanitized) {
      delete sanitized[key]
    }
  })

  if ('admin' in sanitized) {
    sanitized.admin = { ...sanitized.admin }

    const serverOnlyGlobalAdminProperties: Partial<ServerOnlyGlobalAdminProperties>[] = [
      'components',
      'hidden',
      'preview',
    ]

    serverOnlyGlobalAdminProperties.forEach((key) => {
      if (key in sanitized.admin) {
        delete sanitized.admin[key]
      }
    })

    if ('livePreview' in sanitized.admin) {
      sanitized.admin.livePreview = { ...sanitized.admin.livePreview }
      delete sanitized.admin.livePreview.url
    }
  }

  return sanitized
}

export const createClientGlobalConfigs = (
  globals: SanitizedConfig['globals'],
): ClientGlobalConfig[] => globals.map((global) => createClientGlobalConfig(global))