
export interface Payload {
  id: number;
  email: string;
}

export interface RequestWithUser extends Request {
  user: Payload;
}
