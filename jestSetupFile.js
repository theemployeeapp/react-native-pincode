import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
  getInternetCredentials: jest.fn(() => Promise.resolve({ data: {} })),
  ACCESS_CONTROL: {
    APPLICATION_PASSWORD: 'hello'
  }
}));
