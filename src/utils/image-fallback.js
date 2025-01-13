import { useState } from "react";

export function ImageFallback({ src, children, ...props }) {
  const [error, setError] = useState(false);

  if (error) {
    return <>{children}</>;
  }

  return <img src={src} {...props} onError={() => setError(true)} />;
}
