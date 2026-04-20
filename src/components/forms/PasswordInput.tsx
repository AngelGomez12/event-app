'use client';

import { useState } from 'react';
import { TextField, IconButton } from '@radix-ui/themes';
import { Eye, EyeOff, Key } from 'lucide-react';

interface PasswordInputProps extends Omit<React.ComponentPropsWithoutRef<typeof TextField.Root>, 'type'> {
  showLeftIcon?: boolean;
}

export const PasswordInput = ({ showLeftIcon = true, ...props }: PasswordInputProps) => {
  const [show, setShow] = useState(false);

  return (
    <TextField.Root
      {...props}
      type={show ? 'text' : 'password'}
    >
      {showLeftIcon && (
        <TextField.Slot>
          <Key size={16} />
        </TextField.Slot>
      )}
      <TextField.Slot side="right">
        <IconButton
          variant="ghost"
          size="1"
          color="gray"
          type="button"
          onClick={() => setShow(!show)}
          style={{ cursor: 'pointer' }}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </IconButton>
      </TextField.Slot>
    </TextField.Root>
  );
};
