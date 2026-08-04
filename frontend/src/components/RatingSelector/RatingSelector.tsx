import { FaStar } from "react-icons/fa";

import "./RatingSelector.css";

interface RatingSelectorProps {
  value: number | null;
  onChange: (rating: number) => void;
}

const ratingOptions = [
  { rating: 5, top: 2, bottom: 3 },
  { rating: 4, top: 2, bottom: 2 },
  { rating: 3, top: 1, bottom: 2 },
  { rating: 2, top: 0, bottom: 2 },
  { rating: 1, top: 0, bottom: 1 },
];

export default function RatingSelector({
  value,
  onChange,
}: RatingSelectorProps) {
  return (
    <section className="rating-selector">
      <h3 className="rating-title">
        How would you rate our app so far?
      </h3>

      <div className="rating-list">
        {ratingOptions.map(({ rating, top, bottom }) => (
          <button
  key={rating}
  type="button"
  className={`rating-card rating-${rating} ${
    value === rating ? "selected" : ""
  }`}
  onClick={() => onChange(rating)}
>
            <div className="icon-box">
              {top > 0 && (
                <div className="star-row">
                  {Array.from({ length: top }).map((_, index) => (
                    <FaStar
                      key={index}
                      className={`rating-icon ${
                        value === rating
                          ? "rating-icon-active"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              )}

              <div className="star-row">
                {Array.from({ length: bottom }).map((_, index) => (
                  <FaStar
                    key={index}
                    className={`rating-icon ${
                      value === rating
                        ? "rating-icon-active"
                        : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            <span className="rating-label">
              {rating} Star
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}