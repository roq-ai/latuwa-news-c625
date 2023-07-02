import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { broadcasterValidationSchema } from 'validationSchema/broadcasters';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getBroadcasters();
    case 'POST':
      return createBroadcaster();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBroadcasters() {
    const data = await prisma.broadcaster
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'broadcaster'));
    return res.status(200).json(data);
  }

  async function createBroadcaster() {
    await broadcasterValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.news?.length > 0) {
      const create_news = body.news;
      body.news = {
        create: create_news,
      };
    } else {
      delete body.news;
    }
    const data = await prisma.broadcaster.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
