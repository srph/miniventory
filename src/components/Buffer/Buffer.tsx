import React from "react";

interface BufferProps {
  children: React.ReactNode;
}

const Buffer: React.FC<BufferProps> = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export { Buffer };
