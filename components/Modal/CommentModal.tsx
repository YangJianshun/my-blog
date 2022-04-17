import React, { useState, useRef } from 'react';
// @ts-ignore
import ReactDOM from 'react-dom';
import style from './Modal.module.css';
import Checkbox from '../Checkbox';

interface Props {
  show?: boolean;
  title?: string;
  onOk?: (value: {content: string, author: string}) => void;
  onCancel?: () => void;
}

const CommentModal: React.FC<Props> = (props) => {

  const {
    show = false,
    title = '评论',
    onOk,
    onCancel,
  } = props;

  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [noticeEmpty, setNoticeEmpty] = useState(false);

  if (!show) return null;
  return (
    <div className={style.background}>
      <div className={style.container}>
        <div className={style.title}>{title}</div>
        <textarea
          className='resize-none w-full h-20 border-2'
          autoFocus
          value={content}
          onChange={(e) => {
            setNoticeEmpty(!e.target.value)
            setContent(e.target.value)
          }}
        ></textarea>
        { noticeEmpty ? <p className='text-red-500'>评论不能为空哦～</p> : null }
        <div className='flex flex-row justify-between items-center h-12' >
          {isAnonymous ? (
            <div />
          ) : (
            <input
              type='text'
              placeholder='昵称～'
              className='w-20 h-10 border-2'
              value={author}
              onChange={(e) => {setAuthor(e.target.value)}}
            />
          )}
          <div className='flex justify-center items-center'>
            <Checkbox 
              checked={isAnonymous}
              onClick={() => {
                setIsAnonymous(!isAnonymous);
                setAuthor('');
              }}
            />
            <span className='text-2xl'>匿名</span>
          </div>
        </div>
        <div className={style.btnContainer}>
          <div
            className={`${style.btnCancel} ${style.btn}`}
            onClick={() => {
              onCancel && onCancel();
            }}
          >
            取消
          </div>
          <div
            className={`${style.btnOk} ${style.btn}`}
            onClick={() => {
              if (!content) {
                setNoticeEmpty(true);
                return;
              }
              onOk && onOk({ content, author });
            }}
          >
            确认
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;

let modalDiv: HTMLDivElement;

export async function showCommentModal(props: Props) {
  if (!modalDiv) {
    modalDiv = document.createElement('div');
    document.body.appendChild(modalDiv);
  }

  const close = () => {
    ReactDOM.unmountComponentAtNode(modalDiv);
  }

  const {title, onOk, onCancel} = props;
  return new Promise<{ content: string; author: string } | false>((resolve) => {
    ReactDOM.render(
      <CommentModal
        title={title}
        onOk={(comment) => {
          onOk && onOk(comment);
          resolve(comment);
          close();
        }}
        onCancel={() => {
          onCancel && onCancel();
          resolve(false);
          close();
        }}
        show={true}
      />,
      modalDiv
    );
  });
}