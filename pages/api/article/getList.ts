import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/db/connect';
import Article, { IArticle } from '../../../lib/db/models/Article';
import { Res, RET } from '../../../lib/types/request';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Res>,
) {

  await dbConnect();

  try {
    const articles = await Article.find({});
    res
      .status(200)
      .json({
        ret: RET.SUCCESS,
        data: articles.reverse().map(({ id, title, author, locked }) => ({
          id,
          title,
          author,
          locked,
        })),
      });
  } catch (error) {
    res.status(200).json({ ret: RET.SYSTEM_ERROR });
  }
  
}
