
export interface Payload {
  id: string;
  email: string;
}

export interface RequestWithUser extends Request {
  user: Payload;
}
