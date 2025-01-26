export const splitPath = (path: string) => {
  return path.replace(/\\/g, "/").split("/");
};
