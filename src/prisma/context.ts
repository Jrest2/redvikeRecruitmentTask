import { AsyncLocalStorage } from "async_hooks";

const asyncContext = new AsyncLocalStorage<{
  userId: number;
  email: string;
}>();

export const setRequestContext = (
  userId: number,
  email: string,
  fn: () => void | Promise<void>,
) => asyncContext.run({ userId, email }, fn);

export const getRequestContext = () => asyncContext.getStore();
