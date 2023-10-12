export const promptModifier = (prompt: string) => {
  const output = prompt
    .replaceAll("- Upscaled by", "")
    .replaceAll("*", "")
    .replaceAll(/ *\([^)]*\) */g, "")
    .replaceAll(/ - .*@.*/g, "")
    .replaceAll(/<.*>/g, "");
  return output;
};
