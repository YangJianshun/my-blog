
export interface BlogTree {
  [blogName: string]: string | BlogTree;
}

export interface BlogMap {
  [blogId: string]: BlogInfo;
}

export interface BlogInfo {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface BlogPath {
  id: string;
}