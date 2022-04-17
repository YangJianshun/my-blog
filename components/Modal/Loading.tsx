import React from 'react';
// @ts-ignore
import ReactDOM from 'react-dom';
import { LoadingOne } from '@icon-park/react';
import style from './Modal.module.css';

interface Props {
  show?: boolean;
}
const Loading: React.FC<Props> = (props) => {

  const {
    show = false,
  } = props;
  if (!show) return null;
  return <div className={style.background}>
    <div className={`${style.loading} animate-spin`}>
      <LoadingOne theme="outline" size="200" fill="#fff"/>
    </div>
  </div>;
};

export default Loading;

