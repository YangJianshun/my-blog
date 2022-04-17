import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Router from 'next/router';
import style from '../../styles/article/article.module.css';
import { Lock, Unlock, Delete, Back, Okay } from '@icon-park/react';
import { useEffect, useState } from 'react';
import Checkbox from '../../components/Checkbox';
import { Input, showNoticeModal } from '../../components/Modal';
import request from '../../lib/request';

const Edit: NextPage = () => {

  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isEmptyContent, setIsEmptyContent] = useState(false);
  const [isEmptyTitle, setIsEmptyTitle] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editPasswd, setEditPasswd] = useState(false);
  const [passwd, setPasswd] = useState('');

  const toggleEditPasswd = () => {
    setEditPasswd(!editPasswd)
  }

  const createArticle = async () => {
    if (!title) {
      setIsEmptyTitle(true);
      return;
    }
    if (!content) {
      setIsEmptyContent(true);
      return;
    }
    try {
      const articleId = (await request({
        url: '/api/article/create',
        data: { title, content, author, passwd: passwd.length === 4 ? passwd : '' },
      })).data.id;
      Router.replace(`/article#${articleId}`);
    } catch {
      showNoticeModal({content: '发布文章失败鸟，请稍后再试试哟～～'});
    }
  }

  if (isEdit) {
    return (
    <div className={style.container}>
      <Head>
        <title>正在编辑～～</title>
        <meta name='description' content='小树洞' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='fixed top-20  w-full h-32 shadow-lg p-2'>
        <textarea
          className='resize-none w-full border-2 h-32 rounded-lg bg-white mx-auto p-3 text-xl'
          onChange={(e) => setContent(e.target.value)}
          onBlur={() => setIsEdit(false)}
          placeholder='请输入～'
          autoFocus
          value={content}
        >
        </textarea>
      </div>
    </div>
    );
  }

  return (
    <div className={style.container}>
      <Head>
        <title>编辑我的内容</title>
        <meta name='description' content='小树洞' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='fixed top-6 left-12 rounded-full w-12 h-12 flex justify-around items-center bg-white shadow-lg z-50'>
        <Link href='/article' passHref={true}>
          <Back theme='outline' size='36' fill='#333' />
        </Link>
      </div>
      <div
        className='fixed top-6 right-12 rounded-full w-12 h-12 flex justify-around items-center bg-white shadow-lg z-50'
        onClick={createArticle}
      >
        <Okay theme='outline' size='24' fill='#333' />
      </div>
      <div
        className='fixed top-6 right-28 rounded-full w-12 h-12 flex justify-around items-center bg-white shadow-lg z-50'
        onClick={toggleEditPasswd}
      >
        {passwd.length === 4 ? (
          <Lock theme='outline' size='24' fill='#333' />
        ) : (
          <Unlock theme='outline' size='24' fill='#333' />
        )}
      </div>
      {editPasswd ? (
        <div className='fixed top-20 left-2 right-2 z-30 bg-white border-2 rounded-2xl h-24 px-2 mb-8'>
          <Input value={passwd} onChange={(newValue) => setPasswd(newValue)} onBlur={toggleEditPasswd} />
        </div>
      ) : null}

      <div className='absolute top-20 bottom-0 left-0 right-0 p-3 overflow-y-scroll'>
        <div className={style.formItem}>
          <span className={style.formItemLabel}>标题</span>
          <input
            type='text'
            className={style.formItemInput}
            value={title}
            onChange={(e) => {
              setIsEmptyTitle(!e.target.value);
              setTitle(e.target.value);
            }}
          />
        </div>
        {isEmptyTitle ? <p className={style.notice}>标题不能为空哦～</p> : null}
        {isAnonymous ? null : (
          <div className={style.formItem}>
            <span className={style.formItemLabel}>作者</span>
            <input
              type='text'
              className={style.formItemInput}
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
              }}
            />
          </div>
        )}
        <div className={style.formItem}>
          <span className={style.formItemLabel}>匿名</span>
          <div>
            <Checkbox
              checked={isAnonymous}
              onClick={() => setIsAnonymous(!isAnonymous)}
            />
          </div>
        </div>

        <div className={style.formItem}>
          <span className={style.formItemLabel}>内容</span>
        </div>
        {isEmptyContent ? <p className={style.notice}>内容不能为空哦～</p> : null}
        {isEdit ? null : (
          <div className={style.formItem}>
            <div
              className={style.contentArea}
              onClick={() => {
                setIsEdit(true);
              }}
            >
              {content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Edit;