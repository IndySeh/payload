import { findVersionByIDOperationGlobal } from 'payload/operations'
import type { Document, PayloadRequest, SanitizedGlobalConfig } from 'payload/types'

import { isolateObjectProperty } from 'payload/utilities'
import type { Context } from '../types.d.ts'

export type Resolver = (
  _: unknown,
  args: {
    draft?: boolean
    fallbackLocale?: string
    id: number | string
    locale?: string
  },
  context: {
    req: PayloadRequest
  },
) => Promise<Document>

export default function findVersionByIDResolver(globalConfig: SanitizedGlobalConfig): Resolver {
  return async function resolver(_, args, context: Context) {
    if (args.locale) context.req.locale = args.locale
    if (args.fallbackLocale) context.req.fallbackLocale = args.fallbackLocale

    const options = {
      id: args.id,
      depth: 0,
      draft: args.draft,
      globalConfig,
      req: isolateObjectProperty(context.req, 'transactionID'),
    }

    const result = await findVersionByIDOperationGlobal(options)
    return result
  }
}
