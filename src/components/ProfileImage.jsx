import React, { useEffect, useState } from "react";
import { isPlaceholderPhoto } from "../utils/constants";

const hueFromName = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % 360;
  return hash;
};

// Shows the user's photo, or their initials on a name-based color when there is
// no usable photo (empty, stock placeholder, or failed to load).
const ProfileImage = ({ photoUrl, firstName = "", lastName = "", className = "", textClass = "text-xl" }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [photoUrl]);

  const fullName = `${firstName} ${lastName}`.trim();
  const alt = fullName || "profile photo";

  if (photoUrl && !failed && !isPlaceholderPhoto(photoUrl)) {
    return (
      <img
        src={photoUrl}
        alt={alt}
        className={`object-cover ${className}`}
        onError={() => setFailed(true)}
      />
    );
  }

  const initials = ((firstName[0] || "") + (lastName[0] || "")).toUpperCase() || "?";
  const hue = hueFromName(fullName || "?");

  return (
    <div
      role="img"
      aria-label={alt}
      className={`flex items-center justify-center font-bold text-white select-none ${textClass} ${className}`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 70% 55%), hsl(${(hue + 45) % 360} 70% 42%))`,
      }}
    >
      {initials}
    </div>
  );
};

export default ProfileImage;
