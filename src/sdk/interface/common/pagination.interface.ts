export interface PaginatedResponse<T> {
  readonly data: T[];

  /**
   * @type uint
   * @minimum 1
   */
  readonly page: number;

  readonly total_count: number;
}

export interface Page {
  /**
   * @type uint
   * @minimum 1
   */
  readonly page?: number;
}
