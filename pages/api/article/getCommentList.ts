import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../../lib/db/connect';
import Comment from '../../../lib/db/models/Comment';
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
    const comments = await Comment.find({articleId});
    res
      .status(200)
      .json({
        ret: RET.SUCCESS,
        data: comments.reverse().map(({ id, author, content }) => ({
          id,
          author,
          content,
        })),
      });
  } catch (error) {
    console.log(error)
    res.status(200).json({ ret: RET.SYSTEM_ERROR });
  }

  
}
