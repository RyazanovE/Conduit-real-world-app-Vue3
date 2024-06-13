import createClient from "openapi-fetch";
import type { paths } from "./v1";
import { backendBaseUrl } from '@/shared/config';
import { useCookies } from 'vue3-cookies';
import type {
  PathsWithMethod,
} from "openapi-typescript-helpers";


const { GET, POST, PUT, DELETE } = createClient<paths>({ baseUrl: backendBaseUrl });

const customGET = (path: PathsWithMethod<paths, 'get'>, options?: any ) => {
  const { cookies } = useCookies();
  const accessToken = cookies.get('token');
  const params = {...options}

  if (accessToken) {
    params.headers = params.headers || {};
    params.headers.Authorization = `Bearer ${accessToken}`;
  }

  return GET(path, params);
};

const customPOST = (path: PathsWithMethod<paths, 'post'>, options?: any) => {
  const { cookies } = useCookies();
  const accessToken = cookies.get('token');
  const params = {...options}

  if (accessToken) {
    params.headers = params.headers || {};
    params.headers.Authorization = `Bearer ${accessToken}`;
  }
  return POST(path, params);
};


export { customGET as GET, customPOST as POST,  PUT, DELETE };