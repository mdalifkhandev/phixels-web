import { useState } from "react";
import { BarChart3 } from "lucide-react";

interface CaseStudyImageProps {
  src?: string;
  alt: string;
  className?: string;
  overlayClassName?: string;
}

export function CaseStudyImage({
  src,
  alt,
  className = "",
  overlayClassName = "",
}: CaseStudyImageProps) {
  const [hasError, setHasError] = useState(false);
  const showImage = !!src?.trim() && !hasError;

  return (
    <div className={`relative overflow-hidden bg-[#07111f] ${className}`}>
      {showImage ? (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onError={() => setHasError(true)}
        />
      ) : null}

      {!showImage ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_top,_rgba(0,205,73,0.22),_transparent_35%),linear-gradient(135deg,_#08101a,_#0b1b2f)] text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-[color:var(--vibrant-green)]">
            <BarChart3 size={28} />
          </div>
          <div className="max-w-xs">
            <div className="text-white font-semibold line-clamp-2">{alt}</div>
            <div className="text-xs uppercase tracking-[0.25em] text-gray-400 mt-2">
              Case Study
            </div>
          </div>
        </div>
      ) : null}

      {overlayClassName ? (
        <div className={`absolute inset-0 ${overlayClassName}`} />
      ) : null}
    </div>
  );
}
