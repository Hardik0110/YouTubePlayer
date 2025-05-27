import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface ButtonProps {
  children: ReactNode;
  variant?: string;
  scheme?: 1 | 2 | 3 | 4;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant, 
  scheme = 1, 
  isActive, 
  className = '', 
  onClick 
}) => {
  return (
    <StyledWrapper 
      $variant={variant} 
      $scheme={scheme} 
      $isActive={isActive} 
      className={className}
    >
      <button onClick={onClick}>
        {children}
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div<{ $variant?: string; $scheme?: number; $isActive?: boolean; }>`
  button {
    position: relative;
    border: none;
    padding: ${props => props.$variant === 'category' ? '0.5em 1em' : '1em'};
    font-weight: bold;
    text-transform: uppercase;
    transition: all 0.2s;
    border-radius: 5px;
    letter-spacing: 3px;
    font-size: ${props => props.$variant === 'category' ? '0.9em' : '1em'};
    
    ${props => props.$variant === 'category' ? `
      background: ${props.$isActive ? '#DA1212' : '#041562'};
      color: ${props.$isActive ? '#11468F' : '#DA1212'};
      border: 3px solid ${props.$isActive ? '#11468F' : '#DA1212'};
      min-width: 100px;
      transform: ${props.$isActive ? 'scale(1.05)' : 'scale(1)'};
      opacity: ${props.$isActive ? '1' : '0.9'};
    ` : `
      --bg:rgb(255, 25, 0);
      --text-color: #fff;
      background: var(--bg);
      color: var(--text-color);
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: #c0392b 0px 4px 2px, #000 0px 4px 3px;
    `}
    
    &:hover {
      opacity: 1;
      transform: ${props => props.$variant === 'category' && props.$isActive ? 'scale(1.05)' : 'scale(1.02)'};
    }

    &:active {
      transform: ${props => props.$variant === 'category' ? 'scale(0.98)' : 'translateY(2px)'};
      box-shadow: ${props => props.$variant !== 'category' && '#c0392b 0px 2px 2px, #000 0px 2px 3px'};
    }
  }
`;

export default Button;
