import { render, screen, fireEvent } from '@testing-library/react';
import { OAuthButtons } from '@/components/sign-up/OAuthButtons';
import { useSignIn } from '@clerk/nextjs';
import { handleOAuthSignIn } from '@/lib/clerk';

jest.mock('@clerk/nextjs', () => ({
  useSignIn: jest.fn(),
}));

jest.mock('@/lib/clerk', () => ({
  handleOAuthSignIn: jest.fn(),
}));

describe('OAuthButtons Component', () => {
  it('renders Google and Apple sign-in buttons', () => {
    render(<OAuthButtons />);

    expect(screen.getByText(/google/i)).toBeInTheDocument();
    expect(screen.getByText(/apple/i)).toBeInTheDocument();
  });

  it('calls handleOAuthSignIn when Google button is clicked', () => {
    const mockSignIn = jest.fn();
    (useSignIn as jest.Mock).mockReturnValue(mockSignIn);

    render(<OAuthButtons />);

    const googleButton = screen.getByText(/google/i);
    fireEvent.click(googleButton);

    expect(handleOAuthSignIn).toHaveBeenCalledWith(
      mockSignIn,
      'google',
      '/onboarding'
    );
  });

  it('calls handleOAuthSignIn when Apple button is clicked', () => {
    const mockSignIn = jest.fn();
    (useSignIn as jest.Mock).mockReturnValue(mockSignIn);

    render(<OAuthButtons />);

    const appleButton = screen.getByText(/apple/i);
    fireEvent.click(appleButton);

    expect(handleOAuthSignIn).toHaveBeenCalledWith(
      mockSignIn,
      'apple',
      '/onboarding'
    );
  });
});
