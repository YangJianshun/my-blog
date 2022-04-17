import React from 'react';
import { Check } from '@icon-park/react';

interface Props {
  checked: boolean;
  onClick?: (checked: boolean) => void;
}
const Checkbox: React.FC<Props> = (props) => {

  const {checked, onClick} = props;

  return (
    <div className='border-2 border-gray-300 w-6 h-6 flex justify-center items-center bg-white rounded-lg' onClick={() => {
      onClick && onClick(checked);
    }}>
      {checked ? <Check theme='outline' size='24' fill='rgb(209, 213, 219)' /> : null}
    </div>
  );
};


export default Checkbox;