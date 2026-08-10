import React, { useState, useEffect } from 'react';

interface StarRatingWidgetProps {
  toolId: string;
  defaultRating?: number;
  defaultCount?: number;
  onRatingChange?: (rating: number, count: number) => void;
}

const StarRatingWidget: React.FC<StarRatingWidgetProps> = ({ 
  toolId, 
  defaultRating = 4.8, 
  defaultCount = 125,
  onRatingChange
}) => {
  const [rating, setRating] = useState<number>(defaultRating);
  const [count, setCount] = useState<number>(defaultCount);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchRatings() {
      try {
        const response = await fetch(`/api/ratings?toolId=${toolId}`);
        if (!response.ok) return;
        const data = await response.json();
        const dbRating = data.rating;
        const dbCount = data.count || 0;

        let mergedCount = defaultCount;
        let mergedRating = defaultRating;

        if (dbCount > 0) {
          mergedCount = defaultCount + dbCount;
          mergedRating = Number((((defaultRating * defaultCount) + ((dbRating || 0) * dbCount)) / mergedCount).toFixed(1));
        }

        if (mounted) {
          setRating(mergedRating);
          setCount(mergedCount);
          if (onRatingChange) {
            onRatingChange(mergedRating, mergedCount);
          }
        }
      } catch (err) {
        // Fallback to initial state if offline
      }
    }

    // Check if user already rated this tool
    const savedData = localStorage.getItem(`rating_state_${toolId}`);
    if (savedData) {
      try {
        const { userVote } = JSON.parse(savedData);
        setUserRating(userVote);
      } catch (e) {
        // silent
      }
    }

    fetchRatings();

    return () => { mounted = false; };
  }, [toolId, defaultRating, defaultCount]);

  const handleRate = async (value: number) => {
    if (userRating !== null) return; // Prevent multiple ratings
    
    // Optimistic update
    setUserRating(value);
    const newCount = count + 1;
    const newTotal = (rating * count) + value;
    const newRating = Number((newTotal / newCount).toFixed(1));

    setRating(newRating);
    setCount(newCount);

    // Save to local storage to persist user's vote
    localStorage.setItem(`rating_state_${toolId}`, JSON.stringify({
      userVote: value
    }));

    if (onRatingChange) {
      onRatingChange(newRating, newCount);
    }

    // Persist to D1 DB
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId, ratingValue: value })
      });
      
      if (response.ok) {
        const data = await response.json();
        const dbRating = data.rating;
        const dbCount = data.count || 0;
        
        let mergedCount = defaultCount;
        let mergedRating = defaultRating;

        if (dbCount > 0) {
          mergedCount = defaultCount + dbCount;
          mergedRating = Number((((defaultRating * defaultCount) + ((dbRating || 0) * dbCount)) / mergedCount).toFixed(1));
        }
        
        setRating(mergedRating);
        setCount(mergedCount);
        if (onRatingChange) {
          onRatingChange(mergedRating, mergedCount);
        }
      }
    } catch (err) {
      // Offline or error, we still have optimistic UI
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 text-center shadow-sm relative overflow-hidden flex flex-col items-center justify-between min-h-[320px]">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50/60 rounded-bl-[10rem] opacity-50 blur-2xl flex-shrink-0"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-50/60 rounded-tr-[10rem] opacity-50 blur-2xl flex-shrink-0"></div>
      
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-2 font-display">
          Rate This <span className="text-amber-500">Tool</span>
        </h3>
        <p className="text-sm md:text-base text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
          How would you rate your experience with the Online Text Difference Checker? Help us improve by leaving a rating!
        </p>
        
        <div className="flex flex-col items-center gap-4">
          <div 
            className="flex gap-2 p-3 bg-slate-50/80 rounded-2xl border border-slate-100"
            onMouseLeave={() => setHoverRating(null)}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`p-1 transition-all focus:outline-none ${userRating !== null ? 'cursor-default cursor-not-allowed opacity-80' : 'cursor-pointer hover:scale-110'}`}
                onMouseEnter={() => {
                  if (userRating === null) setHoverRating(star);
                }}
                onClick={() => handleRate(star)}
                disabled={userRating !== null}
              >
                <svg 
                  className={`w-10 h-10 transition-colors ${
                    (hoverRating !== null ? star <= hoverRating : star <= (userRating || Math.round(rating)))
                      ? 'text-amber-400 fill-current drop-shadow-[0_2px_4px_rgba(251,191,36,0.2)]'
                      : 'text-slate-200 fill-current'
                  }`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            ))}
          </div>
          
          <div className="text-sm font-extrabold text-slate-600 bg-slate-50 border border-slate-100 px-4 py-1.5 rounded-full tracking-wide">
            {rating} <span className="font-normal text-slate-400">/</span> 5.0
            <span className="font-normal text-slate-400 ml-1.5">({count} total votes)</span>
          </div>
        </div>
      </div>
      
      <div className="h-10 mt-6 relative z-10 flex items-center justify-center">
        {userRating !== null ? (
          <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-4 py-2 rounded-full uppercase tracking-wider animate-in fade-in zoom-in duration-300">
            ⭐ Thanks for your rating!
          </span>
        ) : (
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Click a star to submit your rating instantly
          </span>
        )}
      </div>
    </div>
  );
};

export default StarRatingWidget;
