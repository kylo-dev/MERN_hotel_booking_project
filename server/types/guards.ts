import { Request } from "express";

export interface AuthRequest extends Request {
  auth?: {
    userId?: string;
  };
  user?: any;
  body: any;
}

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

// 에러 타입 가드
export const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};
