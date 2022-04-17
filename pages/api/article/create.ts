import type { NextApiRequest, NextApiResponse } from 'next'
// @ts-ignore
import uniqid from 'uniqid';
import dbConnect from '../../../lib/db/connect';
import Article, { IArticle } from '../../../lib/db/models/Article';
import { Res, RET } from '../../../lib/types/request';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Res>,
) {

  await dbConnect();

  try {
    const {title, content, author = '匿名', passwd} = req.body;
    
    if (![title, content, author].filter(Boolean).length) {
      return res.status(200).json({ ret: RET.WRONG_PARAMETER, msg: 'Wrong parameter' });
    }
    const id = uniqid();
    const locked = !!passwd;
    await Article.create({ title, content, author, id, passwd, locked });
    res.status(200).json({ ret: RET.SUCCESS, data: { id } });
  } catch (error) {
    console.log(error)
    res.status(200).json({ ret: RET.SYSTEM_ERROR });
  }

  
}
