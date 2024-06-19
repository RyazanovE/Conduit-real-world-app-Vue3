import { AxiosResponse } from 'axios';
import { api } from '@/app/api/_index';
import { EmptyOkResponse, MultipleCommentsResponse, SingleArticleResponse, ProfileResponse, NewCommentRequest, SingleCommentResponse, Article, NewArticleRequest, UpdateArticleRequest} from '@/shared/models';
import { bindAll } from '@/shared/utils';

class ArticleReadService {
  constructor() {
    bindAll(this); 
  }

  private getAuthorization() {
    let token = ''
    const user = localStorage.getItem('user');

    if (user) {
      token = JSON.parse(user).token
    }

    return { Authorization: `Token ${token}`}
  }

  getArticle(slug: string) {
    const headers = this.getAuthorization();

    return api.get<SingleArticleResponse>(`/articles/${slug}`, { headers })
  }

  createArticle(article: Partial<Article>) {
    const headers = this.getAuthorization();

    return api.post<NewArticleRequest, AxiosResponse<SingleArticleResponse>>("/articles", { article }, { headers })
  }

  editArticle(slug: string, article: Partial<Article>) {
    const headers = this.getAuthorization();

    return api.put<UpdateArticleRequest, AxiosResponse<SingleArticleResponse>>(`/articles/${slug}`, { article }, { headers })
  }

  deleteArticle(slug: string) {
    const headers = this.getAuthorization();

    return api.delete<EmptyOkResponse>(`/articles/${slug}`, { headers })
  }
  favoriteArticle(slug: string) {
    const headers = this.getAuthorization();

    return api.post<SingleArticleResponse>(`/articles/${slug}/favorite`, undefined, { headers })
  }
  unfavoriteArticle(slug: string) {
    const headers = this.getAuthorization();

    return api.delete<SingleArticleResponse>(`/articles/${slug}/favorite`, { headers })
  }

  getArticleComments(slug: string) {
    const headers = this.getAuthorization();

    return api.get<MultipleCommentsResponse>(`/articles/${slug}/comments`, { headers })
  }

  createArticleComments(slug: string, body: string) {
    const headers = this.getAuthorization();
    const payload = { comment: { body } };

    return api.post<NewCommentRequest, AxiosResponse<SingleCommentResponse>>(`/articles/${slug}/comments`, payload , { headers })
  }
  
  deleteArticleComments(slug: string, id: number) {
    const headers = this.getAuthorization();

    return api.delete<NewCommentRequest, AxiosResponse<EmptyOkResponse>>(`/articles/${slug}/comments/${id}`, { headers })
  }

  followAuthor(username: string) {
    const headers = this.getAuthorization();

    return api.post<ProfileResponse>(`/profiles/${username}/follow`, undefined, { headers })
  }
  unfollowAuthor(username: string) {
    const headers = this.getAuthorization();

    return api.delete<ProfileResponse>(`/profiles/${username}/follow`, { headers })
  }


}

export const articleReadService = new ArticleReadService();