import { UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';
export interface AuthenticatedUser { id?: string; userId?: string; sub?: string; email?: string; role?: string; }
export function authenticatedUserId(user: AuthenticatedUser): string {
  const id = user?.id ?? user?.userId ?? user?.sub;
  if (!id || !Types.ObjectId.isValid(id)) throw new UnauthorizedException('Authenticated user ID is missing or invalid. Please sign in again.');
  return new Types.ObjectId(id).toString();
}
