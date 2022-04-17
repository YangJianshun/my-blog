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
    const { id } = req.body;
    if (!id) {
      return res.status(200).json({ ret: RET.WRONG_PARAMETER });
    }
    const result = await Article.findOneAndRemove({id});
    if (!result) {
      return res.status(200).json({ ret: RET.WRONG_PARAMETER, msg: 'id not exists' });
    }
    res.status(200).json({
      ret: RET.SUCCESS,
      data: { id },
    });
  } catch (error) {
    res.status(200).json({ ret: RET.SYSTEM_ERROR });
  }
  
}
