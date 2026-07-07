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
    <div className="bg-white px-6 py-5 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <h4 className="text-slate-900 font-bold tracking-tight text-sm uppercase">Rate This Tool</h4>
        <p className="text-xs text-slate-500 mt-1">Help others by sharing your experience</p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div 
          className="flex gap-1"
          onMouseLeave={() => setHoverRating(null)}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`p-1 transition-all focus:outline-none ${userRating !== null ? 'cursor-default cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
              onMouseEnter={() => {
                if (userRating === null) setHoverRating(star);
              }}
              onClick={() => handleRate(star)}
              disabled={userRating !== null}
            >
              <svg 
                className={`w-8 h-8 md:w-6 md:h-6 transition-colors ${
                  (hoverRating !== null ? star <= hoverRating : star <= (userRating || Math.floor(rating)))
                    ? 'text-yellow-400 fill-current'
                    : 'text-slate-200 fill-current'
                }`}
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          ))}
        </div>
        
        <div className="text-xs font-semibold text-slate-500 tracking-wide">
          {rating} <span className="font-normal text-slate-400">/</span> 5.0
          <span className="font-normal text-slate-400 ml-1">({count} votes)</span>
        </div>
      </div>
      
      <div className="h-8 flex items-center justify-center">
        {userRating !== null && (
          <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-xl uppercase tracking-wider animate-in fade-in zoom-in duration-300">
            Thanks for rating!
          </span>
        )}
      </div>
    </div>
  );
};

export default StarRatingWidget;
