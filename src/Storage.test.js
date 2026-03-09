import { loadFromStorage, saveToStorage } from './Arete';

describe('Storage Helpers', () => {
  const originalLocalStorage = global.localStorage;
  const originalConsoleWarn = console.warn;

  beforeEach(() => {
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    console.warn = jest.fn();
  });

  afterEach(() => {
    global.localStorage = originalLocalStorage;
    console.warn = originalConsoleWarn;
  });

  describe('loadFromStorage', () => {
    it('returns parsed value from localStorage if it exists', () => {
      const data = { foo: 'bar' };
      localStorage.getItem.mockReturnValue(JSON.stringify(data));
      const result = loadFromStorage('test_key', {});
      expect(result).toEqual(data);
      expect(localStorage.getItem).toHaveBeenCalledWith('test_key');
    });

    it('returns defaultValue if key does not exist', () => {
      localStorage.getItem.mockReturnValue(null);
      const result = loadFromStorage('test_key', { default: true });
      expect(result).toEqual({ default: true });
    });

    it('returns defaultValue if JSON.parse fails', () => {
      localStorage.getItem.mockReturnValue('invalid-json');
      const result = loadFromStorage('test_key', { default: true });
      expect(result).toEqual({ default: true });
    });
  });

  describe('saveToStorage', () => {
    it('saves stringified value to localStorage', () => {
      const data = { key: 'value' };
      saveToStorage('test_key', data);
      expect(localStorage.setItem).toHaveBeenCalledWith('test_key', JSON.stringify(data));
    });

    it('logs a warning if localStorage.setItem throws an error', () => {
      const error = new Error('Storage full');
      localStorage.setItem.mockImplementation(() => {
        throw error;
      });

      saveToStorage('test_key', { data: 'some data' });

      expect(console.warn).toHaveBeenCalledWith('localStorage save failed:', error);
    });
  });
});
