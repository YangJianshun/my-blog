import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/db/connect';
import Article from '../../../lib/db/models/Article';
import { Res, RET } from '../../../lib/types/request';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Res>,
) {

  await dbConnect();

  try {
    const { articleId } = req.body;
    
    if (!articleId) {
      return res.status(200).json({ ret: RET.WRONG_PARAMETER, msg: 'Wrong parameter' });
    }
    const article = await Article.findOne({id: articleId});
    res
      .status(200)
      .json({
        ret: RET.SUCCESS,
        data: article.content
      });
  } catch (error) {
    console.log(error)
    res.status(200).json({ ret: RET.SYSTEM_ERROR });
  }

  
}
