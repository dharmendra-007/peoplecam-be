export const validateFile = (file, type) => {
  if (type === "issue") {
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.mimetype)) {
      throw new Error("Invalid file type for issue image");
    }
  }
  if (type === "invoice") {
    if (file.mimetype !== "application/pdf") {
      throw new Error("Invalid file type for invoice");
    }
  }
};
