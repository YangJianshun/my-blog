import React from 'react';
// @ts-ignore
import ReactDOM from 'react-dom';
import style from './Modal.module.css';

interface Props {
  show?: boolean;
  title?: string;
  content?: string;
  onOk?: () => void;
  onCancel?: () => void;
}
const ConfirmModal: React.FC<Props> = (props) => {

  const {
    show = false,
    title = '提示：',
    content = '确认继续吗？',
    onOk,
    onCancel,
  } = props;
  if (!show) return null;
  return <div className={style.background}>
    <div className={style.container}>
      <div className={style.title}>{title}</div>
      <div className={style.content}>{content}</div>
      <div className={style.btnContainer}>
        <div className={`${style.btnCancel} ${style.btn}`} onClick={() => {
          onCancel && onCancel();
        }}>取消</div>
        <div className={`${style.btnOk} ${style.btn}`} onClick={() => {
          onOk && onOk();
        }}>确认</div>
      </div>
    </div>
  </div>;
};

export default ConfirmModal;

let modalDiv: HTMLDivElement;

export async function showConfirmModal(props: Props) {
  if (!modalDiv) {
    modalDiv = document.createElement('div');
    document.body.appendChild(modalDiv);
  }

  const close = () => {
    ReactDOM.unmountComponentAtNode(modalDiv);
  }

  const {title, content, onOk, onCancel} = props;
  return new Promise(resolve => {
    ReactDOM.render(
      <ConfirmModal
        title={title}
        content={content}
        onOk={() => {
          onOk && onOk();
          resolve(true);
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
  })
}