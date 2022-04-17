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
    const { id, passwd } = req.body;
    if (![id, passwd].filter(Boolean).length) {
      return res.status(200).json({ ret: RET.WRONG_PARAMETER });
    }
    const article = await Article.findOne({id});
    if (!article) {
      return res.status(200).json({ ret: RET.WRONG_PARAMETER, msg: 'id not exists' });
    }
    const result = article.locked ?  article?.passwd === passwd : true;
    res.status(200).json({
      ret: RET.SUCCESS,
      data: result,
    });
  } catch (error) {
    res.status(200).json({ ret: RET.SYSTEM_ERROR });
  }
  
}
