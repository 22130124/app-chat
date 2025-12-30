export const formatMessageTime = (time) => {
  if (!time) return "";

  let date;

  // Nếu là ISO chuẩn có Z
  if (typeof time === "string" && time.includes("Z")) {
    date = new Date(time);
  }
  // Nếu là "YYYY-MM-DD HH:mm:ss" (backend)
  else if (typeof time === "string") {
    // Ép về ISO UTC
    const iso = time.replace(" ", "T") + "Z";
    date = new Date(iso);
  }
  // Nếu là Date object
  else {
    date = new Date(time);
  }

  if (isNaN(date.getTime())) return "";

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
};
