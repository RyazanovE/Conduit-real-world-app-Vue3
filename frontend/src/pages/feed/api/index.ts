import { api } from '@/app/api/_index';
import { MultipleArticlesResponse, TagsResponse } from '@/pages/feed';
import { SingleArticleResponse } from '@/shared/models';
import { bindAll } from '@/shared/utils';

export interface Pagination {
  tag: string | null;
  page: number;
  limit: number;
  source: string;
}

export const LIMIT = 20;

class FeedApiService {
  constructor() {
    bindAll(this); 
  }

  private getAuthorization() {
    let token = ''
    const user = localStorage.getItem('user');

    if (user) {
      token = JSON.parse(user).token
    }


    return token ? { Authorization: `Token ${token}`} : {}
  }

  getArticles(page: Pagination['page'] = 1, tag?: Pagination['tag'], limit: Pagination['limit'] = LIMIT, source?: Pagination['source']) {
    const headers = this.getAuthorization();

    const options = { 
      params: {
        tag: tag ?? undefined, 
        limit, 
        offset: limit * (page - 1) 
      },
      headers
    };

    return api.get<MultipleArticlesResponse>(source === 'my-feed' ? '/articles/feed' : '/articles', options)
  }

  favouriteArticle(slug: string) {
    const headers = this.getAuthorization();

    return api.post<SingleArticleResponse>(`/articles/${slug}/favorite`, undefined, { headers })
  }

  unfavouriteArticle(slug: string) {
    const headers = this.getAuthorization();

    return api.delete<SingleArticleResponse>(`/articles/${slug}/favorite`, { headers })
  }

  getTags() {
    return api.get<TagsResponse>('/tags')
  }
}

export const feedApiService = new FeedApiService();