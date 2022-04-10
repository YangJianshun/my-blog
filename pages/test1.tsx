import { forwardRef } from 'react';
import React, {
  useState,
  useRef,
  useImperativeHandle,
  useCallback
} from 'react';

// eslint-disable-next-line react/display-name
const Child = forwardRef<any>((prop, ref) => {
  const [count, setCount] = useState(0);
  const [num, setNum] = useState(0);
  const [color, setColor] = useState('black');
  
  useImperativeHandle(ref, () => ({
    name: 'hhh',
    func1: () => console.log('func1'),
    count,
    changeColor: () => setColor('red')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [num])

  return (
    <>
    <button onClick={() => setCount(count + 1)}>set count</button>
    <br />
    <button onClick={() => setNum(num + 1)}>set num</button>
    <h3 style={{color}}>{count}</h3>
    <h3 style={{color}}>{num}</h3>
    </>
  )
})

const Demo = () => {
  const ref1 = useRef();
  return (
    <>
      <Child ref={ref1}/>
      <button onClick={() => {
        console.log(ref1)
      }}>show ref</button>
      <br />
      <button onClick={() => {
        // @ts-ignore
        ref1.current.changeColor();
      }}>change color</button>
    </>
  )
}

export default Demo;