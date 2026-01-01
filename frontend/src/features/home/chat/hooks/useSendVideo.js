import { uploadVideoToCloudinary } from "../services/uploadVideoService";
import { useSendMessage } from "./useSendMessage";

export const useSendVideo = () => {
  const { sendMessage } = useSendMessage();

  const sendVideo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Chỉ được chọn video");
      return;
    }

    const res = await uploadVideoToCloudinary(file);
    const secure_url = res.secure_url;
    const videoMessage = `[video]${secure_url}`;
    sendMessage(videoMessage);

    //reset chọn video
    e.target.value = null;
  };

  return { sendVideo };
};
