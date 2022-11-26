import { AppRequest } from '../models';

/**
 * @param {AppRequest} req
 * @returns {string}
 */
export function getUserIdFromRequest(req: AppRequest): string {
  return req.user && req.user.id || req.query.userId || req.body.user.id;
}
