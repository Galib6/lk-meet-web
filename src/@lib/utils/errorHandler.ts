import { ENV } from '.environments';
import { AxiosError } from 'axios';

export enum ResponseCode {
  // API status codes
  SUCCESS = 200, // success with data
  NO_CONTENT = 201, // success with no content
  BAD_REQUEST = 400, // failure, api rejected the request
  FORBIDDEN = 403, // failure, api rejected the request
  UNAUTHORIZED = 401, // failure user is not authorized
  NOT_FOUND = 404, // failure, api url is not correct and not found
  INTERNAL_SERVER_ERROR = 500, // failure, crash happened in server side
  // local status code
  DEFAULT = -1,
  CONNECT_TIMEOUT = -2,
  CANCEL = -3,
  RECEIVE_TIMEOUT = -4,
  SEND_TIMEOUT = -5,
  CACHE_ERROR = -6,
  NO_INTERNET_CONNECTION = -7,
}

export enum ResponseMessage {
  // API status codes
  SUCCESS = 'Success', // success with data
  NO_CONTENT = 'Success with no content', // success with no content
  BAD_REQUEST = 'Bad request, try again later', // failure, api rejected the request
  FORBIDDEN = 'Forbidden request, try again later', // failure, api rejected the request
  UNAUTHORIZED = 'User is unauthorized, try again later', // failure user is not authorized
  NOT_FOUND = 'Url is not found, try again later', // failure, api url is not correct and not found
  INTERNAL_SERVER_ERROR = 'Internal server error, try again later', // failure, crash happened in server side
  // local status code
  DEFAULT = 'Some thing went wrong, try again later',
  CONNECT_TIMEOUT = 'time out error, try again later',
  CANCEL = 'Request was cancelled, try again later',
  RECEIVE_TIMEOUT = 'Time out error, try again later',
  SEND_TIMEOUT = 'Send time out error, try again later',
  CACHE_ERROR = 'Cache error, try again later',
  NO_INTERNET_CONNECTION = 'Please check your internet connection',
}
export enum ApiInternalStatus {
  SUCCESS = 200,
  CREATED = 201,
  FAILURE = 400,
  UNAUTHORIZED = 401,
}

export const Failure = (code?: ResponseCode, message?: ResponseMessage) => ({
  code: code ?? ResponseCode.DEFAULT,
  message: message ?? ResponseMessage.DEFAULT,
});

export const ErrorHandler = (error: AxiosError) => {
  if (!ENV.isProduction) {
    const message = `${error.message} --> method: ${error.config?.method} --> url: ${error.config?.url}`;
    return Failure(error.code as any, message as any);
  }
  const { response } = error;

  if (!response?.status) return Failure();

  switch (response?.status) {
    case ResponseCode.SUCCESS:
      return Failure(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    case ResponseCode.NO_CONTENT:
      return Failure(ResponseCode.NO_CONTENT, ResponseMessage.NO_CONTENT);
    case ResponseCode.BAD_REQUEST:
      return Failure(ResponseCode.BAD_REQUEST, ResponseMessage.BAD_REQUEST);
    case ResponseCode.FORBIDDEN:
      return Failure(ResponseCode.FORBIDDEN, ResponseMessage.FORBIDDEN);
    case ResponseCode.UNAUTHORIZED:
      return Failure(ResponseCode.UNAUTHORIZED, ResponseMessage.UNAUTHORIZED);
    case ResponseCode.NOT_FOUND:
      return Failure(ResponseCode.NOT_FOUND, ResponseMessage.NOT_FOUND);
    case ResponseCode.INTERNAL_SERVER_ERROR:
      return Failure(ResponseCode.INTERNAL_SERVER_ERROR, ResponseMessage.INTERNAL_SERVER_ERROR);
    default:
      return Failure(ResponseCode.DEFAULT, ResponseMessage.DEFAULT);
  }
};

export const methodSuccessMessage = (method: 'POST' | 'PUT' | 'DELETE' | string): string => {
  switch (method.toUpperCase()) {
    case 'POST':
      return 'Created Success';
    case 'PUT':
      return 'Update Success';
    case 'DELETE':
      return 'Delete Success';
    default:
      return '';
  }
};
