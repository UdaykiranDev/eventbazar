const publicUrl = process.env.PUBLIC_URL || "";

const publicAssetUrl = (path) => {
  if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) {
    return path;
  }

  if (!publicUrl || path === publicUrl || path.startsWith(`${publicUrl}/`)) {
    return path;
  }

  return `${publicUrl}${path}`;
};

export default publicAssetUrl;
