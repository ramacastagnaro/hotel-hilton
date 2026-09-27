import { renderHook } from '@testing-library/react';
import { useAuth } from '../context/AuthContext';
import { useCanMutate } from './useCanMutate';

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('useCanMutate', () => {
  it('is false for the read-only demo role (DEMO-4)', () => {
    useAuth.mockReturnValue({ role: 'demo' });
    const { result } = renderHook(() => useCanMutate());
    expect(result.current).toBe(false);
  });

  it('is true for admin and operador', () => {
    useAuth.mockReturnValue({ role: 'admin' });
    expect(renderHook(() => useCanMutate()).result.current).toBe(true);

    useAuth.mockReturnValue({ role: 'operador' });
    expect(renderHook(() => useCanMutate()).result.current).toBe(true);
  });
});
