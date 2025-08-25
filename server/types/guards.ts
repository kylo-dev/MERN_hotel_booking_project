import { Request } from "express";

// AuthRequest 타입 가드
export interface AuthRequest extends Request {
  auth?: {
    userId?: string;
  };
  user?: any;
  body: any;
}

export const isAuthRequest = (req: Request): req is AuthRequest => {
  return "auth" in req;
};

// FileRequest 타입 가드 (파일 업로드용)
export interface FileRequest extends Request {
  files?: any[];
  body: any;
}

export const isFileRequest = (req: Request): req is FileRequest => {
  return "files" in req;
};

// CombinedRequest 타입 가드 (인증 + 파일 업로드)
export interface CombinedRequest extends Request {
  auth?: {
    userId?: string;
  };
  user?: any;
  files?: any[];
  body: any;
}

export const isCombinedRequest = (req: Request): req is CombinedRequest => {
  return "auth" in req && "files" in req;
};

// 에러 타입 가드
export const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

// Express 미들웨어 타입 가드
export const isRequestHandler = (handler: any): handler is Function => {
  return typeof handler === "function";
};
