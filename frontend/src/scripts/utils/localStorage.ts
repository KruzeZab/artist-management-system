export const getItem = (key: string) => {
  return localStorage.getItem(key);
};

export const setItem = (key: string, value: string) => {
  return localStorage.setItem(key, value);
};

export const deleteItem = (key: string) => {
  localStorage.removeItem(key);
};
