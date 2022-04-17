import React, { useState, useRef } from 'react';
// @ts-ignore
import ReactDOM from 'react-dom';
import style from './Modal.module.css';
import { useEffect } from 'react';

interface Props {
  show?: boolean;
  title?: string;
  onOk?: (value: string) => void;
  onCancel?: () => void;
}

export const Input: React.FC<{
  value: string;
  onChange: (newValue: string) => void;
  onBlur?: () => void;
}> = (props) => {
  const { value, onChange, onBlur } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocus, setIsFocus] = useState(false);
  const inputFocus = () => {
    inputRef.current!.focus();
  }

  useEffect(() => {
    inputRef.current!.value = value; 
  }, [])

  return (
    <div>
      <input
        type='text'
        className={style.passwdInputHide}
        ref={inputRef}
        onChange={(e) => {
          if (e.target.value.length > 4) {
            e.target.value = e.target.value.slice(0, 4);
          }
          onChange(e.target.value);
        }}
        onFocus={() => {
          setIsFocus(true);
        }}
        onBlur={() => {
          onBlur && onBlur();
          setIsFocus(false);
        }}
        autoFocus
      />
      <br />
      <div className={style.passwdInputContainer}>
        {[0, 1, 2, 3].map(index => (
          <div className={`${style.passwdInput} ${isFocus ? style.passwdInputFocus : ''}`} key={index} onClick={inputFocus}>{value[index] || ''}</div>
        ))}
      </div>
    </div>
  );
};

const CheckModal: React.FC<Props> = (props) => {

  const {
    show = false,
    title = '请输入密码：',
    onOk,
    onCancel,
  } = props;

  const [value, setValue] = useState('');

  if (!show) return null;
  return <div className={style.background}>
    <div className={style.container}>
      <div className={style.title}>{title}</div>
      <Input value={value} onChange={newValve => setValue(newValve)}/>
      <div className={style.btnContainer}>
        <div className={`${style.btnCancel} ${style.btn}`} onClick={() => {
          onCancel && onCancel();
        }}>取消</div>
        <div className={`${style.btnOk} ${style.btn}`} onClick={() => {
          onOk && onOk(value);
        }}>确认</div>
      </div>
    </div>
  </div>;
};

export default CheckModal;

let modalDiv: HTMLDivElement;

export async function showCheckModal(props: Props) {
  if (!modalDiv) {
    modalDiv = document.createElement('div');
    document.body.appendChild(modalDiv);
  }

  const close = () => {
    ReactDOM.unmountComponentAtNode(modalDiv);
  }

  const {title, onOk, onCancel} = props;
  return new Promise<string | false>(resolve => {
    ReactDOM.render(
      <CheckModal
        title={title}
        onOk={(value) => {
          onOk && onOk(value);
          resolve(value);
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