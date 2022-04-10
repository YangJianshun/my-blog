import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import 'highlight.js/styles/isbl-editor-dark.css';
import { getBlogTree } from '../../lib/blog';
import { BlogTree } from '../../lib/blog/types';
import React, { useState } from 'react';

interface BlogListItem {
  title: string;
  id: string;
}

const Blog: NextPage<BlogTree> = (blogTree) => {
  const [blogList, setBlogList] = useState<BlogListItem[]>([]);
  const [curCategory, setCurCategory] = useState<string>('');
  const [notShowSubCategory, setNotShowSubCategory] = useState<{
    [key: string]: boolean;
  }>({});

  const renderBlogIndex = () => {
    const hiddenClass = curCategory ? 'hidden' : 'block';
    return (
      <div className='group'>
        <div className={`bg-blue-100 h-8 md:hidden`}>{curCategory}</div>
        <div
          className={`hidden group-hover:block bg-yellow-100 md:block`}
        >
          {renderBlogTree(blogTree)}
        </div>
      </div>
    );
  };

  const renderBlogTree = (blogTree: BlogTree) => {
    return (
      <ul className='ml-3'>
        {Object.keys(blogTree).map((blogCategory) => {
          const subBlogTree = blogTree[blogCategory];
          // 是一个 isCategory，而不是 Blog
          const isCategory = !(typeof subBlogTree === 'string');
          const hasSubBlogTree = isCategory && Object.keys(subBlogTree).some(s => typeof subBlogTree[s] !== 'string');
          const collapseIcon = hasSubBlogTree
            ? notShowSubCategory[blogCategory]
              ? '>'
              : 'V'
            : null;
          return (
            isCategory && (
              <React.Fragment key={blogCategory}>
                <li
                  className='h-8'
                  key={blogCategory}
                  onClick={() => {
                    setBlogList(
                      Object.keys(subBlogTree)
                        .filter(
                          (blogName) =>
                            typeof subBlogTree[blogName] === 'string'
                        )
                        .map((blogName) => ({
                          title: blogName,
                          id: subBlogTree[blogName] as string,
                        }))
                    );
                    setCurCategory(blogCategory);
                  }}
                >
                  {blogCategory}
                  {
                    <div
                      className='inline-block ml-2'
                      onClick={(event) => {
                        setNotShowSubCategory({
                          ...notShowSubCategory,
                          [blogCategory]: !notShowSubCategory[blogCategory],
                        });
                        event.stopPropagation();
                      }}
                    >
                      {collapseIcon}
                    </div>
                  }
                </li>
                <li key={`${blogCategory}_subCategory`} className={`${notShowSubCategory[blogCategory] ? 'hidden' : 'block'}`}>
                  {renderBlogTree(subBlogTree as BlogTree)}
                </li>
              </React.Fragment>
            )
          );
        })}
      </ul>
    );
    // return Object.keys(blogTree).map(blogName => (<>{blogName}</>))
  };

  const renderBlogList = () => (
    <ul>
      {blogList.map(({ title, id }) => (
        <li key={id}>
          <Link href={`/blog/${id}`}>{title}</Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <Head>
        <title>my blog</title>
        <meta name='description' content='my blog' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {renderBlogIndex()}
      {renderBlogList()}
    </div>
  );
};

export default Blog;

export async function getStaticProps() {
  const blogTree = getBlogTree();
  return {
    props: blogTree,
  };
}
