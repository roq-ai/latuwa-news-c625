import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { newsValidationSchema } from 'validationSchema/news';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.news
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getNewsById();
    case 'PUT':
      return updateNewsById();
    case 'DELETE':
      return deleteNewsById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getNewsById() {
    const data = await prisma.news.findFirst(convertQueryToPrismaUtil(req.query, 'news'));
    return res.status(200).json(data);
  }

  async function updateNewsById() {
    await newsValidationSchema.validate(req.body);
    const data = await prisma.news.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteNewsById() {
    const data = await prisma.news.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
