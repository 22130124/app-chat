import { uploadImageToCloudinary } from "../services/uploadImageService";
import { useSendMessage } from "./useSendMessage";
import { toast } from "react-toastify";

export const useSendImage = () => {
  const { sendMessage } = useSendMessage();

  const sendImage = async (e) => {
    // Lấy ra ảnh đầu tiên (chưa xử lý chọn nhiều ảnh)
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Chỉ được chọn ảnh");
      return;
    }

    // Gọi Upload ảnh sang dịch vụ bên thứ 3
    const res = await uploadImageToCloudinary(file);
    // Lấy ra địa chỉ URL của ảnh được trả về
    const secureUrl = res.secure_url;
    // Tạo nội dung tin nhắn để gửi qua socket
    // Vì backend hiện tại chỉ hỗ trợ gửi text nên thêm prefix [image] để frontend biết đây là hình ảnh
    const imageMessage = `[image]${secureUrl}`;
    sendMessage(imageMessage);

    // Reset để chọn lại cùng ảnh
    // Nếu không có dòng này thì lần sau chọn lại cùng ảnh sẽ không chạy được onChange
    e.target.value = null;
  };

  return { sendImage };
};
