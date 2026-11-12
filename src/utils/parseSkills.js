// Skills may arrive as a comma separated string or as an array
export const parseSkills = (skills) => {
  if (!skills) return [];
  // The backend stores "React, Node" as one array element, so split every entry
  const list = Array.isArray(skills) ? skills : [skills];
  return list.flatMap((s) => String(s).split(",")).map((s) => s.trim()).filter(Boolean);
};
