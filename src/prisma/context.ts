import { AsyncLocalStorage } from "async_hooks";

const asyncContext = new AsyncLocalStorage<{
  userId: string;
  email: string;
}>();

export const setRequestContext = (
  userId: string,
  email: string,
  fn: () => void | Promise<void>,
) => asyncContext.run({ userId, email }, fn);

export const getRequestContext = () => asyncContext.getStore();
