declare module 'jsonwebtoken' {
  export function sign(username: string, password: string, _id: string): string;
  export function verify(token: string, secretKey: string, options: { maxAge: string }): any;
};