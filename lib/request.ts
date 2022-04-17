import axios from 'axios';
interface ReqParams {
  url: string,
  data?: Record<string, any>,
  method?: 'post' | 'get'
}
export default async function request(params: ReqParams) {
  const {url, data, method = 'post'} = params;
  switch (method) {
    case 'get':
      return (await axios[method](url)).data
    default:
      return (await axios[method](url, data)).data
  }
}
