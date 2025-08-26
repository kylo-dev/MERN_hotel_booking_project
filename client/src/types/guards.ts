// 에러 타입 가드
export const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};
