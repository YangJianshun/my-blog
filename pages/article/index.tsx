import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head';
import request from '../../lib/request';
import style from '../../styles/article/article.module.css';
import { IArticle } from '../../lib/db/models/Article';
import { IComment } from '../../lib/db/models/Comment';
import { Lock, Delete, Edit, Back } from '@icon-park/react';
import {
  showConfirmModal,
  showCheckModal,
  showNoticeModal,
  showCommentModal,
  Input
} from '../../components/Modal';
import Loading from '../../components/Modal/Loading';

const Article: NextPage = () => {
  const [articleList, setArticleList] = useState<IArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState<IArticle>();
  const [id, setId] = useState('');
  const [commentList, setCommentList] = useState<IComment[]>([]);
  // 是否已经输如果密码（如果是从首页点进去，就肯定会输密码，就是true，如果直接进入detail 就是false）
  const [unLock, setUnlock] = useState(false);
  // 在 detail 中用户输入密码
  const [passwd, setPasswd] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const id = window.location.hash.slice(1);
    id && setId(id);
    getList().then((list) => {
      const article = list.find(article => article.id === id);
      article && setArticle(article);
    });
  }, []);

  useEffect(() => {
    if (!article) return;
    getCommentList();
    getContent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article])

  const getList = async () => {
    setLoading(true);
    const list = await request({ url: '/api/article/getList' });
    setLoading(false);
    setArticleList(list.data);
    return list.data as IArticle[];
  }

  const getCommentList = async () => {
    const list = await request({ url: '/api/article/getCommentList', data: {articleId: id} });
    setCommentList(list.data);
    return list.data as IComment[];
  }

  const getContent = async () => {
    const content = (await request({ url: '/api/article/getContent', data: {articleId: id} })).data;
    setContent(content);
    return content as string;
  }

  const goBackToList = () => {
    window.location.hash = '';
    setId('');
    setArticle(undefined);
    setUnlock(false);
  };

  const goToDetail = async (article: IArticle) => {
    const passwdRight = await checkPasswdModal(article);
    if (!passwdRight) return;
    setUnlock(true);
    window.location.hash = article.id;
    setId(article.id);
    setArticle(article);
  }
  const checkPasswd = async (passwd: string, article: IArticle) => {
    setLoading(true);
      const passwdRight = (
        await request({
          url: '/api/article/checkPasswd',
          data: { id: article.id, passwd },
        })
      ).data;
      setLoading(false);
      if (!passwdRight) {
        await showNoticeModal({});
      }
      return passwdRight as boolean;
  }
  const checkPasswdModal = async (article: IArticle) => {
    if (article.locked) {
      const passwd = await showCheckModal({});
      if (!passwd) return false;
      return checkPasswd(passwd, article);
    }
    return true;
  }

  const renderArticleCard = (article: IArticle) => {
    return (
      <div
        className='bg-white shadow-lg rounded-3xl h-36 w-72 md:w-96 mb-10 mx-auto p-6 flex justify-between'
        key={article.id}
        onClick={() => goToDetail(article)}
      >
        <div className='flex flex-col justify-around w-10/12'>
          <div className='text-3xl w-full overflow-hidden whitespace-nowrap overflow-ellipsis'>
            {article.title}
          </div>
          <div className='text-2xl overflow-hidden whitespace-nowrap overflow-ellipsis text-gray-300'>{`作者: ${article.author}`}</div>
        </div>
        <div className='flex flex-col justify-around w-2/12'>
          {article.locked ? (
            <Lock theme='outline' size='24' fill='#333' />
          ) : (
            <div />
          )}
          <Delete
            theme='outline'
            size='24'
            fill='#333'
            className='transform hover:scale-110'
            onClick={async (e) => {
              e.stopPropagation();
              const confirm = await showConfirmModal({
                content: '您真的要删除这篇文章么？',
              });
              if (!confirm) return;
              const passwdRight = await checkPasswdModal(article);
              if (!passwdRight) return;
              setLoading(true);
              await axios.post('/api/article/remove', { id: article.id });
              setLoading(false);
              getList();
            }}
          />
        </div>
      </div>
    );
  };

  const renderArticleList = () => {
    return articleList.map(article => renderArticleCard(article))
  }

  const renderListPage = () => {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={style['background-img']}
          src='/avatorDefault.png'
          alt=''
        />
        <div className='absolute top-12 right-12 rounded-full w-12 h-12 flex justify-around items-center bg-white shadow-lg z-50'>
          <Link href='/article/addArticle' passHref={true}>
            <Edit theme='outline' size='36' fill='#333' />
          </Link>
        </div>
        <div className={style.listContainer}>{renderArticleList()}</div>
        <Loading show={loading} />
      </>
    );
      
  }

  const renderDetailPage = () => {

    if (loading) {
      return  <Loading show={loading} />
    }

    if (id && !article) {
      return (
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className='fixed top-6 left-12 rounded-full w-12 h-12 flex justify-around items-center bg-white shadow-lg z-50'>
            <Back
              theme='outline'
              size='36'
              fill='#333'
              onClick={goBackToList}
            />
          </div>
          <img
            className={`w-36 h-36 animate-bounce mt-72 mx-auto`}
            src='/avatorDefault.png'
            alt=''
          />
          <div className='mx-auto text-center text-3xl text-gray-400'>
            这篇文章没有找到哦～
          </div>
          <div
            className='w-48 h-12 border-2 border-gray-300 text-gray-400 rounded-full text-center text-2xl flex justify-around items-center mx-auto my-5'
            onClick={goBackToList}
          >
            返回列表～
          </div>
        </div>
      );
    }

    if (!unLock && article && article.locked) {
      return (
        <>
          <div className='fixed top-6 left-12 rounded-full w-12 h-12 flex justify-around items-center bg-white shadow-lg z-50'>
            <Back
              theme='outline'
              size='36'
              fill='#333'
              onClick={goBackToList}
            />
          </div>
          <div className='w-80 h-60 mx-auto mt-36'>
            <p className='text-gray-600 text-center text-4xl mb-8'>
              访问当前文章需要密码～～～
            </p>
            <div className='bg-white border-2 rounded-2xl w-80 h-24 px-2 mb-8'>
              <Input
                value={passwd}
                onChange={(newPasswd) => setPasswd(newPasswd)}
              />
            </div>
            <div className='w-48 h-12 border-2 rounded-2xl bg-white shadow-lg text-2xl mx-auto flex justify-around items-center' onClick={async () => {
              const passwdRight = await checkPasswd(passwd, article);
              if (!passwdRight) return;
              setUnlock(true);
            }}>
              确认密码
            </div>
          </div>
        </>
      );
    }

    return (
      <div className={`${style.detailContainer} p-3`}>
        <div className='fixed top-6 left-12 rounded-full w-12 h-12 flex justify-around items-center bg-white shadow-lg z-50'>
          <Back theme='outline' size='36' fill='#333' onClick={goBackToList} />
        </div>
        <div className='fixed top-6 right-12 rounded-full w-12 h-12 flex justify-around items-center bg-white shadow-lg z-50'>
          <Delete
            theme='outline'
            size='36'
            fill='#333'
            onClick={async (e) => {
              e.stopPropagation();
              const confirm = await showConfirmModal({
                content: '您真的要删除这篇文章么？',
              });
              if (!confirm) return;
              const passwdRight = await checkPasswdModal(article!);
              if (!passwdRight) return;
              setLoading(true);
              await axios.post('/api/article/remove', { id: article!.id });
              setLoading(false);
              getList();
              goBackToList();
            }}
          />
        </div>
        <div className='text-center text-4xl my-4 mt-16'>{article!.title}</div>
        <div className='text-center text-2xl mb-6'>{article!.author}</div>
        {/* 正文 */}
        <div className='whitespace-pre-wrap text-2xl rounded-3xl bg-white shadow-xl p-6 mb-6'>
          {content}
        </div>
        {/* 评论 */}
        <div className='whitespace-pre-wrap text-2xl rounded-3xl bg-white shadow-xl mb-12'>
          <div className='w-full border-b-2 border-gray-200 p-3'>{`评论 ${commentList.length} 条`}</div>

          {commentList.map((comment) => (
            <div
              className='w-full border-b border-gray-200 p-3 text-2xl flex flex-row items-center justify-between'
              key={comment.id}
            >
              <div>
                <div className='text-1xl pl-4'>{`${comment.author}：`}</div>
                <div className='text-1xl pl-4'>{comment.content}</div>
              </div>
              <Delete
                theme='outline'
                size='24'
                fill='#333'
                className='transform hover:scale-110 ml-2 mr-2'
                onClick={async (e) => {
                  e.stopPropagation();
                  const confirm = await showConfirmModal({
                    content: '您真的要删除这条评论么？',
                  });
                  if (!confirm) return;

                  setLoading(true);
                  await axios.post('/api/article/removeComment', {
                    id: comment.id,
                  });
                  setLoading(false);
                  getCommentList();
                }}
              />
            </div>
          ))}
        </div>
        {/* 写评论 */}
        <div
          className='fixed bottom-0 left-1.5 right-1.5 h-12 bg-white rounded-t-3xl shadow-xl p-3 px-6 text-2xl flex flex-row items-center border border-gray-100'
          onClick={async () => {
            const comment = await showCommentModal({});
            if (!comment) return;
            setLoading(true);
            await request({url: '/api/article/addComment', data: {articleId: id, ...comment}});
            await getCommentList();
            setLoading(false);
            console.log();
          }}
        >
          写评论
          <Edit theme='outline' size='30' fill='#333' />
        </div>
      </div>
    );
  }

  return (
    <div className={style.container}>
      <Head>
        <title>小树洞～～</title>
        <meta name="description" content="小树洞" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {id || article ? renderDetailPage() : renderListPage()}
    </div>
  );
};

export default Article;