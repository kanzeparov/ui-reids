export const isObjectEmpty = (object: object) => {
  return Object.getOwnPropertyNames(object).length === 0;
};
