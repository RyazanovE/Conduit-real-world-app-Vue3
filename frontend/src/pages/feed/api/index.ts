import { api } from '@/app/api/_index';
import { MultipleArticlesResponse, TagsResponse } from '@/shared/api/models';

export interface Pagination {
  tag: string | null;
  page: number;
  limit: number;
}

export const LIMIT = 20;

class FeedApiService {
  getArticles(page: Pagination['page'] = 1, tag?: Pagination['tag'], limit: Pagination['limit'] = LIMIT) {
    const options = { 
      params: {
        query: { 
          tag: tag ?? undefined, 
          limit, 
          offset: limit * (page - 1) 
        } 
      } 
    };

    return api.get<MultipleArticlesResponse>('/articles', options)
  }

  getTags() {
    return api.get<TagsResponse>('/tags')
  }
}

export const feedApiService = new FeedApiService();