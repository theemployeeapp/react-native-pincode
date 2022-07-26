jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: jest.fn(() => Promise.resolve({ data: {} })),
    multiRemove: jest.fn(() => Promise.resolve({ data: {} })),
    setItem: jest.fn(() => Promise.resolve({ data: {} }))
  }
}))

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
  getInternetCredentials: jest.fn(() => Promise.resolve({ data: {} })),
  ACCESS_CONTROL: {
    APPLICATION_PASSWORD: 'hello'
  }
}));
