export type ResponseErrorType = {
  status: number;
  message: string;
};
export type ResponseSuccessType<T = unknown> = {
  status: number;
  message: string;
  data: T;
};
export type ResponseSuccessListType<T = unknown> = {
  status: number;
  message: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};
