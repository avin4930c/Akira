import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { signUpIcons } from '@/resources/icons';

interface ButtonFillProps {
  text: string;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  // New customization props
  width?: string;
  height?: string;
  padding?: string;
  borderRadius?: string;
  fontSize?: string;
  fontWeight?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function ButtonFill({
  text,
  onClick,
  className = '',
  icon,
  width,
  height,
  padding = 'py-4 px-4',
  borderRadius = 'rounded-xl',
  fontSize = 'md:text-lg text-base',
  fontWeight = 'font-medium',
  disabled = false,
  fullWidth = true,
}: ButtonFillProps) {
  const style = {
    width: width || (fullWidth ? '100%' : 'auto'),
    height: height || 'auto',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={`
        flex items-center justify-center
        bg-[#0D4671]
        text-white
        transition-all
        hover:bg-[#0D4671]/90
        active:scale-[0.99]
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:active:scale-100
        ${padding}
        ${borderRadius}
        ${fontSize}
        ${fontWeight}
        ${className}
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </button>
  );
}

export const ButtonFillWithIcons = ({
  provider,
  iconPath = '',
  className = '',
  ...props
}: { provider: string; iconPath?: string } & Partial<ButtonFillProps>) => (
  <ButtonFill
    text={`Continue with ${provider}`}
    icon={
      <Image
        width={22}
        height={22}
        src={
          iconPath ||
          signUpIcons[
            `${provider.toLowerCase()}Icon` as keyof typeof signUpIcons
          ]
        }
        alt="Logo"
      />
    }
    className={`max-w-md mx-auto ${className}`}
    {...props}
  />
);

interface OnboardingButtonProps {
  text?: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const OnboardingButton = ({
  text = 'Continue',
  onClick,
  disabled = false,
  icon,
}: OnboardingButtonProps) => {
  return (
    <div className="fixed bottom-8 left-0 right-0 px-6 max-w-sm mx-auto">
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-full flex items-center justify-between bg-[#0D4671] text-white py-4 px-6 rounded-[32px] text-lg font-medium
          hover:bg-[#0D4671]/90 transition-all disabled:bg-[#D3D3D3] disabled:cursor-not-allowed"
      >
        <div className="flex items-center">
          {icon && <span className="mr-3">{icon}</span>}
          {text}
        </div>
        <ArrowRight className="w-6 h-6" />
      </button>
    </div>
  );
};
