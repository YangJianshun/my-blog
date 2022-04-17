import type { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import uniqid from 'uniqid';
import dbConnect from '../../../lib/db/connect';
import Comment from '../../../lib/db/models/Comment';
import { Res, RET } from '../../../lib/types/request';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Res>,
) {

  await dbConnect();

  try {
    const { articleId, content, author } = req.body;
    
    if (![articleId, content].filter(Boolean).length) {
      return res.status(200).json({ ret: RET.WRONG_PARAMETER, msg: 'Wrong parameter' });
    }
    const id = uniqid();
    await Comment.create({ id, articleId, content, author: author || '匿名' });
    res.status(200).json({ ret: RET.SUCCESS, data: { id } });
  } catch (error) {
    console.log(error)
    res.status(200).json({ ret: RET.SYSTEM_ERROR });
  }

  
}
