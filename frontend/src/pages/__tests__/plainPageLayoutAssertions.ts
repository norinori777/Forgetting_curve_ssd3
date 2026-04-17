export const hasNoCardShellMarkup = (markup: string): boolean => {
  return !markup.includes("background:#fff") && !markup.includes("box-shadow:") && !markup.includes("margin:0 auto") && !markup.includes("max-width:");
};