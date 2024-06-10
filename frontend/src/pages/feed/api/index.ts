import { GET } from '@/shared/api';

class FeedApiService {
  limit: number = 20

  constructor(limit?: number) {
    if (limit) {
      this.limit = limit;
    }
  }

  getArticles(tag?: string) {
    return GET('/articles', { params: { query: { tag } } })
  }

  getTags() {
    return GET('/tags')
  }
}

export const feedApiService = new FeedApiService();