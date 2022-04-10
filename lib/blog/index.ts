import path from 'path';
import fs from 'fs';
import { BlogTree, BlogMap, BlogPath, BlogInfo } from './types';
import { marked } from 'marked';
import matter from 'gray-matter';

function getBlogsInfo() {

  let idIndex = 0;
  function readdirDeep(dir: string): { blogTree: BlogTree; blogInfos: BlogInfo[], blogMap: BlogMap } {
    const blogTree: BlogTree = {},
      blogInfos: BlogInfo[] = [],
      blogMap: BlogMap = {};
    const files = fs.readdirSync(dir);
    for (let file of files) {
      const filePath = path.join(dir, file);
      const isDir = fs.lstatSync(filePath).isDirectory();
      if (isDir) {
        const { blogInfos: subBlogInfo, blogTree: subBlogTree, blogMap: subBlogMap } = readdirDeep(filePath);
        blogInfos.push(...subBlogInfo);
        blogTree[file] = subBlogTree;
        Object.assign(blogMap, subBlogMap)
      } else if (filePath.endsWith('.md')) {
        const fileContents = fs.readFileSync(filePath).toString();
        const matterResult = matter(fileContents)
        const html = marked(matterResult.content);
        const blogId = `s-${idIndex++}`;
        const blogInfo = {
          id: blogId,
          title: file.replace('.md', ''),
          content: html,
          date: matterResult.data.date,
        };
        blogInfos.push(blogInfo);
        blogTree[file] = blogId;
        blogMap[blogId] = blogInfo;
      }
    }
    return { blogTree, blogInfos, blogMap };
  }

  return readdirDeep('./blogs/');
}

const { blogInfos, blogTree, blogMap } = getBlogsInfo();

export function getBlogPaths() {
  return blogInfos.map(({ id }) => ({ params: { id } }));
}

export function getBlogInfo(blogId: string) {
  return blogMap[blogId] || null;
}

export function getBlogTree() {
  return blogTree;
}

export * from './types';