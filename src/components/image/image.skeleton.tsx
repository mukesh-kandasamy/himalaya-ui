'use client';
import React from 'react';

interface Props {
  opacity?: number;
}

export type ImageSkeletonProps = Props;

const ImageSkeleton: React.FC<ImageSkeletonProps> = React.memo(({ opacity = 0.5, ...props }: ImageSkeletonProps) => {
  return (
    <div className="skeleton" {...props}>
      <style jsx>{`
        .skeleton {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          background-image: linear-gradient(
            270deg,
            var(--color-background-800),
            var(--color-background-700),
            var(--color-background-700),
            var(--color-background-800)
          );
          background-size: 400% 100%;
          animation: loading 3s ease-in-out infinite;
          opacity: ${opacity};
          transition: opacity 300ms ease-out;
        }

        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          to {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
});

ImageSkeleton.displayName = 'HimalayaImageSkeleton';
export default ImageSkeleton;
