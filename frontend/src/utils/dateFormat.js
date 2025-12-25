//Format time theo định dạng "HH:mm dd/MM/yyyy"
export const formatMessageTime = (timeString) => {
  if (!timeString) {
    // Nếu không có time, dùng thời gian hiện tại
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  }

  let date;

  // Nếu là Date object
  if (timeString instanceof Date) {
    date = timeString;
  } else {
    date = new Date(timeString);

    // Nếu parse không thành công, thử format khác
    if (isNaN(date.getTime())) {
      // Thử parse format "YYYY-MM-DD HH:mm:ss"
      const match = timeString.match(
        /(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/
      );
      if (match) {
        date = new Date(
          parseInt(match[1]),
          parseInt(match[2]) - 1,
          parseInt(match[3]),
          parseInt(match[4]),
          parseInt(match[5]),
          parseInt(match[6])
        );
      } else {
        // Nếu vẫn không parse được, dùng thời gian hiện tại
        date = new Date();
      }
    }
  }

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
};
