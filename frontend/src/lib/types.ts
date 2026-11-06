export type LoginResponse = {
  token: string;
};

export type Tag = {
  id: number;
  name: string;
  count: number;
};

/** Shape of a Laravel API Resource collection response: { data: T[] }. */
export type ApiCollection<T> = {
  data: T[];
};

/** Shape of a single Laravel API Resource response: { data: T }. */
export type ApiResource<T> = {
  data: T;
};
