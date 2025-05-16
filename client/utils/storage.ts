type StorageType = 'local' | 'session';

const getStorage = (type: StorageType): Storage => {
  if (typeof window === 'undefined') {
    throw new Error('Cannot access storage on the server side');
  }
  return type === 'local' ? localStorage : sessionStorage;
};

export const getItem = <T>(key: string, type: StorageType = 'local'): T | null => {
  try {
    const storage = getStorage(type);
    const item = storage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting item ${key} from ${type}Storage:`, error);
    return null;
  }
};

export const setItem = <T>(
  key: string,
  value: T,
  type: StorageType = 'local'
): void => {
  try {
    const storage = getStorage(type);
    storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item ${key} in ${type}Storage:`, error);
  }
};

export const removeItem = (key: string, type: StorageType = 'local'): void => {
  try {
    const storage = getStorage(type);
    storage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key} from ${type}Storage:`, error);
  }
};

export const clear = (type: StorageType = 'local'): void => {
  try {
    const storage = getStorage(type);
    storage.clear();
  } catch (error) {
    console.error(`Error clearing ${type}Storage:`, error);
  }
};

export const storage = {
  getItem,
  setItem,
  removeItem,
  clear,
};
