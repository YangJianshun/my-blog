import React from 'react';
// @ts-ignore
import ReactDOM from 'react-dom';
import style from './Modal.module.css';

interface Props {
  show?: boolean;
  title?: string;
  content?: string;
  onOk?: () => void;
}
const NoticeModal: React.FC<Props> = (props) => {

  const {
    show = false,
    title = '注意：',
    content = '密码错误！您无权操作哦～',
    onOk,
  } = props;
  if (!show) return null;
  return <div className={style.background}>
    <div className={style.container}>
      <div className={style.title}>{title}</div>
      <div className={style.content}>{content}</div>
      <div className={style.btnContainer}>
        <div className={`${style.btnOk} ${style.btn}`} onClick={() => {
          onOk && onOk();
        }}>确认</div>
      </div>
    </div>
  </div>;
};

export default NoticeModal;

let modalDiv: HTMLDivElement;

export async function showNoticeModal(props: Props) {
  if (!modalDiv) {
    modalDiv = document.createElement('div');
    document.body.appendChild(modalDiv);
  }

  const close = () => {
    ReactDOM.unmountComponentAtNode(modalDiv);
  }

  const {title, content, onOk} = props;
  return new Promise(resolve => {
    ReactDOM.render(
      <NoticeModal
        title={title}
        content={content}
        onOk={() => {
          onOk && onOk();
          resolve(true);
          close();
        }}
        show={true}
      />,
      modalDiv
    );
  })
}