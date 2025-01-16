import { useState } from "react";

export default function Truncate({
  text,
  limit,
  className = "",
  showMore = true,
}) {
  const [more, setMore] = useState(false);

  if (text.length <= limit) {
    return text;
  }

  return (
    <>
      {more ? text : text.slice(0, limit)}
      {showMore ? (
        <span
          data-more="true"
          className={`cursor-pointer text-brand-primary ${className}`}
          onClick={(e) => {
            e.stopPropagation();
            setMore(!more);
          }}
        >
          {more ? " ...less" : " ...more"}
        </span>
      ) : (
        "..."
      )}
    </>
  );
}
