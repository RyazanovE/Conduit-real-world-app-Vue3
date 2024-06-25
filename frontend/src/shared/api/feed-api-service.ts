import { api } from '@/app/api/_index';
import { MultipleArticlesResponse, SingleArticleResponse, TagsResponse } from '@/shared/models';
import { bindAll } from '@/shared/utils';

interface Pagination {
  page?: number;
  tag?: string;
  limit?: number;
  source?: string;
  author?: string;
  favorited?: string;
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


    return token ? { Authorization: `Token ${token}` } : {}
  }

  getArticles({ page = 1, tag, limit = LIMIT, source,  author, favorited }: Pagination) {
    const headers = this.getAuthorization();

    const options = { 
      params: {
        tag: tag ?? undefined, 
        limit, 
        offset: limit * (page - 1), 
        author, 
        favorited
      },
      headers,
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