import httpStatus from 'http-status'

import { resetPasswordOperation } from 'payload/operations'
import { generatePayloadCookie } from '../../utilities/cookies'
import { CollectionRouteHandler } from '../types'

export const resetPassword: CollectionRouteHandler = async ({ req, collection }) => {
  const { searchParams } = req
  const depth = searchParams.get('depth')

  const result = await resetPasswordOperation({
    collection,
    data: {
      password: typeof req.data?.password === 'string' ? req.data.password : '',
      token: typeof req.data?.token === 'string' ? req.data.token : '',
    },
    depth: depth ? Number(depth) : undefined,
    req,
  })

  const cookie = generatePayloadCookie({
    token: result.token,
    payload: req.payload,
    collectionConfig: collection.config,
  })

  return Response.json(
    {
      // TODO(translate)
      message: 'Password reset successfully.',
      token: result.token,
      user: result.user,
    },
    {
      headers: new Headers({
        'Set-Cookie': cookie,
      }),
      status: httpStatus.OK,
    },
  )
}