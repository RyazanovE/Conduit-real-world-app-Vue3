/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  '/users/login': {
    /**
     * Existing user login
     * @description Login for existing user
     */
    post: operations['Login']
  }
  '/users': {
    /** @description Register a new user */
    post: operations['CreateUser']
  }
  '/user': {
    /**
     * Get current user
     * @description Gets the currently logged-in user
     */
    get: operations['GetCurrentUser']
    /**
     * Update current user
     * @description Updated user information for current user
     */
    put: operations['UpdateCurrentUser']
  }
  '/profiles/{username}': {
    /**
     * Get a profile
     * @description Get a profile of a user of the system. Auth is optional
     */
    get: operations['GetProfileByUsername']
  }
  '/profiles/{username}/follow': {
    /**
     * Follow a user
     * @description Follow a user by username
     */
    post: operations['FollowUserByUsername']
    /**
     * Unfollow a user
     * @description Unfollow a user by username
     */
    delete: operations['UnfollowUserByUsername']
  }
  '/articles/feed': {
    /**
     * Get recent articles from users you follow
     * @description Get most recent articles from users you follow. Use query parameters to limit. Auth is required
     */
    get: operations['GetArticlesFeed']
  }
  '/articles': {
    /**
     * Get recent articles globally
     * @description Get most recent articles globally. Use query parameters to filter results. Auth is optional
     */
    get: operations['GetArticles']
    /**
     * Create an article
     * @description Create an article. Auth is required
     */
    post: operations['CreateArticle']
  }
  '/articles/{slug}': {
    /**
     * Get an article
     * @description Get an article. Auth not required
     */
    get: operations['GetArticle']
    /**
     * Update an article
     * @description Update an article. Auth is required
     */
    put: operations['UpdateArticle']
    /**
     * Delete an article
     * @description Delete an article. Auth is required
     */
    delete: operations['DeleteArticle']
  }
  '/articles/{slug}/comments': {
    /**
     * Get comments for an article
     * @description Get the comments for an article. Auth is optional
     */
    get: operations['GetArticleComments']
    /**
     * Create a comment for an article
     * @description Create a comment for an article. Auth is required
     */
    post: operations['CreateArticleComment']
  }
  '/articles/{slug}/comments/{id}': {
    /**
     * Delete a comment for an article
     * @description Delete a comment for an article. Auth is required
     */
    delete: operations['DeleteArticleComment']
  }
  '/articles/{slug}/favorite': {
    /**
     * Favorite an article
     * @description Favorite an article. Auth is required
     */
    post: operations['CreateArticleFavorite']
    /**
     * Unfavorite an article
     * @description Unfavorite an article. Auth is required
     */
    delete: operations['DeleteArticleFavorite']
  }
  '/tags': {
    /**
     * Get tags
     * @description Get tags. Auth not required
     */
    get: operations['GetTags']
  }
}

export type webhooks = Record<string, never>

export interface components {
  schemas: {
    LoginUser: {
      email: string
      /** Format: password */
      password: string
    }
    NewUser: {
      username: string
      email: string
      /** Format: password */
      password: string
    }
    User: {
      email: string
      token: string
      username: string
      bio: string
      image: string
    }
    UpdateUser: {
      email?: string
      password?: string
      username?: string
      bio?: string
      image?: string
    }
    Profile: {
      username: string
      bio: string
      image: string
      following: boolean
    }
    Article: {
      slug: string
      title: string
      description: string
      body: string
      tagList: string[]
      /** Format: date-time */
      createdAt: string
      /** Format: date-time */
      updatedAt: string
      favorited: boolean
      favoritesCount: number
      author: components['schemas']['Profile']
    }
    NewArticle: {
      title: string
      description: string
      body: string
      tagList?: string[]
    }
    UpdateArticle: {
      title?: string
      description?: string
      body?: string
    }
    Comment: {
      id: number
      /** Format: date-time */
      createdAt: string
      /** Format: date-time */
      updatedAt: string
      body: string
      author: components['schemas']['Profile']
    }
    NewComment: {
      body: string
    }
    GenericErrorModel: {
      errors: {
        body: string[]
      }
    }
  }
  responses: {
    /** @description Tags */
    TagsResponse: {
      content: {
        'application/json': {
          tags: string[]
        }
      }
    }
    /** @description Single comment */
    SingleCommentResponse: {
      content: {
        'application/json': {
          comment: components['schemas']['Comment']
        }
      }
    }
    /** @description Multiple comments */
    MultipleCommentsResponse: {
      content: {
        'application/json': {
          comments: components['schemas']['Comment'][]
        }
      }
    }
    /** @description Single article */
    SingleArticleResponse: {
      content: {
        'application/json': {
          article: components['schemas']['Article']
        }
      }
    }
    /** @description Multiple articles */
    MultipleArticlesResponse: {
      content: {
        'application/json': {
          articles: components['schemas']['Article'][]
          articlesCount: number
        }
      }
    }
    /** @description Profile */
    ProfileResponse: {
      content: {
        'application/json': {
          profile: components['schemas']['Profile']
        }
      }
    }
    /** @description User */
    UserResponse: {
      content: {
        'application/json': {
          user: components['schemas']['User']
        }
      }
    }
    /** @description No content */
    EmptyOkResponse: {
      content: object
    }
    /** @description Unauthorized */
    Unauthorized: {
      content: object
    }
    /** @description Unexpected error */
    GenericError: {
      content: {
        'application/json': components['schemas']['GenericErrorModel']
      }
    }
  }
  parameters: {
    /** @description The number of items to skip before starting to collect the result set. */
    offsetParam?: number
    /** @description The numbers of items to return. */
    limitParam?: number
  }
  requestBodies: {
    /** @description Credentials to use */
    LoginUserRequest: {
      content: {
        'application/json': {
          user: components['schemas']['LoginUser']
        }
      }
    }
    /** @description Details of the new user to register */
    NewUserRequest: {
      content: {
        'application/json': {
          user: components['schemas']['NewUser']
        }
      }
    }
    /** @description User details to update. At least **one** field is required. */
    UpdateUserRequest: {
      content: {
        'application/json': {
          user: components['schemas']['UpdateUser']
        }
      }
    }
    /** @description Article to create */
    NewArticleRequest: {
      content: {
        'application/json': {
          article: components['schemas']['NewArticle']
        }
      }
    }
    /** @description Article to update */
    UpdateArticleRequest: {
      content: {
        'application/json': {
          article: components['schemas']['UpdateArticle']
        }
      }
    }
    /** @description Comment you want to create */
    NewCommentRequest: {
      content: {
        'application/json': {
          comment: components['schemas']['NewComment']
        }
      }
    }
  }
  headers: never
  pathItems: never
}

export type $defs = Record<string, never>

export type external = Record<string, never>

export interface operations {

  /**
   * Existing user login
   * @description Login for existing user
   */
  Login: {
    requestBody: components['requestBodies']['LoginUserRequest']
    responses: {
      200: components['responses']['UserResponse']
      401: components['responses']['Unauthorized']
      422: components['responses']['GenericError']
    }
  }
  /** @description Register a new user */
  CreateUser: {
    requestBody: components['requestBodies']['NewUserRequest']
    responses: {
      201: components['responses']['UserResponse']
      422: components['responses']['GenericError']
    }
  }
  /**
   * Get current user
   * @description Gets the currently logged-in user
   */
  GetCurrentUser: {
    responses: {
      200: components['responses']['UserResponse']
      401: components['responses']['Unauthorized']
      422: components['responses']['GenericError']
    }
  }
  /**
   * Update current user
   * @description Updated user information for current user
   */
  UpdateCurrentUser: {
    requestBody: components['requestBodies']['UpdateUserRequest']
    responses: {
      200: components['responses']['UserResponse']
      401: components['responses']['Unauthorized']
      422: components['responses']['GenericError']
    }
  }
  /**
   * Get a profile
   * @description Get a profile of a user of the system. Auth is optional
   */
  GetProfileByUsername: {
    parameters: {
      path: {
        /** @description Username of the profile to get */
        username: string
      }
    }
    responses: {
      200: components['responses']['ProfileResponse']
      401: components['responses']['Unauthorized']
      422: components['responses']['GenericError']
    }
  }
  /**
   * Follow a user
   * @description Follow a user by username
   */
  FollowUserByUsername: {
    parameters: {
      path: {
        /** @description Username of the profile you want to follow */
        username: string
      }
    }
    responses: {
      200: components['responses']['ProfileResponse']
      401: components['responses']['Unauthorized']
      422: components['responses']['GenericError']
    }
  }
  /**
   * Unfollow a user
   * @description Unfollow a user by username
   */
  UnfollowUserByUsername: {
    parameters: {
      path: {
        /** @description Username of the profile you want to unfollow */
        username: string
      }
    }
    responses: {
      200: components['responses']['ProfileResponse']
      401: components['responses']['Unauthorized']
      422: components['responses']['GenericError']
    }
  }
  /**
   * Get recent articles from users you follow
   * @description Get most recent articles from users you follow. Use query parameters to limit. Auth is required
   */
  GetArticlesFeed: {
    parameters: {
      query?: {
        offset?: components['parameters']['offsetParam']
        limit?: components['parameters']['limitParam']
      }
    }
    responses: {
      200: components['responses']['MultipleArticlesResponse']
      401: components['responses']['Unauthorized']
      422: components['responses']['GenericError']
    }
  }
  /**
   * Get recent articles globally
   * @description Get most recent articles globally. Use query parameters to filter results. Auth is optional
   */
  GetArticles: {
    parameters: {
      query?: {
        /** @description Filter by tag */
        tag?: string
        /** @description Filter by author (username) */
        author?: string
        /** @description Filter by favorites of a user (username) */
        favorited?: string
        offset?: components['parameters']['offsetParam']
        limit?: components['parameters']['limitParam']
      }
    }
    responses: {
      200: components['responses']['MultipleArticlesResponse']
      401: components['responses']['Unauthorized']
      422: components['responses']['GenericError']
    }
  }
  /**
   * Create an article
   * @description Create an article. Auth is required
   */
  CreateArticle: {
    requestBody: components['requestBodies']['NewArticleRequest']
    responses: {
      201: components['responses']['SingleArticleResponse']
      401: components['responses']['Unauthorized']
      422: components['responses']['GenericError']
    }
  }
  /**
   * Get an article
   * @description Get an article. Auth not required
   */
  GetArticle: {
    parameters: {
      path: {
        /** @description Slug of the article to get */
        slug: string
      }
    }
    responses: {
      200: components['responses']['SingleArticleResponse']
      422: components['responses']['GenericError']
    }
  }
  /**
   * Update an article
   * @description Update an article. Auth is required
   */
  UpdateArticle: {
    parameters: {
      path: {
        /** @description Slug of the article to update */
        slug: string
      }
    }
    requestBody: components['requestBodies']['UpdateArticleRequest']
    responses: {
      200: components['responses']['SingleArticleResponse']
      401: components['responses']['Unauthorized']
      422: components['responses']['GenericError']
    }
  }
  /**
   * Delete an article
   * @description Delete an article. Auth is required
   */
  DeleteArticle: {
    parameters: {
      path: {
        /** @description Slug of the article to delete */
        slug: string
      }
    }
    responses: {
      200: components['responses']['EmptyOkResponse']
      401: components['responses']['Unauthorized']
      422: components['responses']['GenericError']
    }
  }
  /**
   * Get comments for an article
   * @description Get the comments for an article. Auth is optional
   */
  GetArticleComments: {
    parameters: {
      path: {
        /** @description Slug of the article that you want to get comments for */
        slug: string
      }
    }
    responses: {
      200: components['responses']['MultipleCommentsResponse']
      401: components['responses']['Unauthorized']
      422: components['responses']['GenericError']
    }
  }
  /**
   * Create a comment for an article
   * @description Create a comment for an article. Auth is required
   */
  CreateArticleComment: {
    parameters: {
      path: {
        /** @description Slug of the article that you want to create a comment for */
        slug: string
      }
    }
    requestBody: components['requestBodies']['NewCommentRequest']
    responses: {
      200: components['responses']['SingleCommentResponse']
      401: components['responses']['Unauthorized']
      422: components['responses']['GenericError']
    }
  }
  /**
   * Delete a comment for an article
   * @description Delete a comment for an article. Auth is required
   */
  DeleteArticleComment: {
    parameters: {
      path: {
        /** @description Slug of the article that you want to delete a comment for */
        slug: string
        /** @description ID of the comment you want to delete */
        id: number
      }
    }
    responses: {
      200: components['responses']['EmptyOkResponse']
      401: components['responses']['Unauthorized']
      422: components['responses']['GenericError']
    }
  }
  /**
   * Favorite an article
   * @description Favorite an article. Auth is required
   */
  CreateArticleFavorite: {
    parameters: {
      path: {
        /** @description Slug of the article that you want to favorite */
        slug: string
      }
    }
    responses: {
      200: components['responses']['SingleArticleResponse']
      401: components['responses']['Unauthorized']
      422: components['responses']['GenericError']
    }
  }
  /**
   * Unfavorite an article
   * @description Unfavorite an article. Auth is required
   */
  DeleteArticleFavorite: {
    parameters: {
      path: {
        /** @description Slug of the article that you want to unfavorite */
        slug: string
      }
    }
    responses: {
      200: components['responses']['SingleArticleResponse']
      401: components['responses']['Unauthorized']
      422: components['responses']['GenericError']
    }
  }
  /**
   * Get tags
   * @description Get tags. Auth not required
   */
  GetTags: {
    responses: {
      200: components['responses']['TagsResponse']
      422: components['responses']['GenericError']
    }
  }
}
