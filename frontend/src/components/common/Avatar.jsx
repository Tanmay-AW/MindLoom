import React, { useState } from 'react';

// A utility to combine class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// A default avatar image using a random generator for placeholders
const DEFAULT_AVATAR = `https://robohash.org/${Math.random().toString(36).substring(7)}.png?set=set4`;

const Avatar = React.forwardRef(
  // --- THIS IS THE FIX ---
  // The component now accepts `children` and renders them inside the container div.
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          "transition-all duration-300 ease-in-out hover:scale-105",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef(
  ({ className, src, alt, onError, onLoad, ...props }, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);

    const finalSrc = src && !imgError ? src : DEFAULT_AVATAR;

    const handleError = (e) => {
      console.log("AvatarImage error occurred, using fallback");
      setImgError(true);
      if (onError) onError(e);
    };

    const handleLoad = (e) => {
      setIsLoaded(true);
      if (onLoad) onLoad(e);
    };

    return (
      <img
        ref={ref}
        src={finalSrc}
        alt={alt || "Avatar"}
        className={cn(
          "aspect-square h-full w-full object-cover",
          "transition-opacity duration-300 ease-in-out",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    );
  }
);
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "absolute inset-0 z-0 flex h-full w-full items-center justify-center rounded-full bg-gray-700 text-white font-bold",
        className
      )}
      {...props}
    >
        {children}
    </div>
  )
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
