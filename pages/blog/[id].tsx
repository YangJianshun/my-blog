import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { getBlogPaths, BlogInfo, BlogPath } from '../../lib/blog';
import { getBlogInfo } from '../../lib/blog/index';
import { useEffect } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/a11y-dark.css';

const BlogDetail: NextPage<BlogInfo> = (props) => {
  useEffect(() => {
    hljs.highlightAll();
  }, [])
  return (
    <div>
      <Head>
        <title>my blog</title>
        <meta name='description' content='my blog' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {/* <h1>{props.id}</h1> */}
      <h1 className='text-center text-3xl md:text-6xl my-12'>{props.title}</h1>
      <h1 className='text-center text-gray-600 text-lg'>{props.date}</h1>
      <div
        dangerouslySetInnerHTML={{ __html: props.content }}
        className='markdown container px-5 md:px-0 mx-auto mb-36 mt-12 max-w-5xl'
      ></div>
    </div>
  );
};

export default BlogDetail;

export async function getStaticPaths() {
  const paths = getBlogPaths();
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params } : {params: BlogPath}) {
  const blogInfo = getBlogInfo(params.id);
  return {
    props: {
      ...blogInfo
    }
  }
}