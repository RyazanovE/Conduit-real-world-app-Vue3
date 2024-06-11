import { GET } from '@/shared/api';

export interface IPagination {
  tag: string | null;
  page: number;
  limit: number;
}

export const LIMIT = 20;

class FeedApiService {
  getArticles(page: IPagination['page'] = 1, tag?: IPagination['tag'], limit: IPagination['limit'] = LIMIT) {
    const options = { 
      params: {
        query: { 
          tag: tag ?? undefined, 
          limit, 
          offset: limit * (page - 1) 
        } 
      } 
    };

    return GET('/articles', options)
  }

  getTags() {
    return GET('/tags')
  }
}

export const feedApiService = new FeedApiService();