import { MessageCircle, Users, Phone, Settings } from "lucide-react";
import { useState } from "react";
import styles from "./IconSidebar.module.scss";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { disconnectSocket } from "../../../../socket/socket";
import { logout } from "../../../auth/slice/authSlice";
import { clearChat } from "../../chat/slice/chatSlice";
import { clearConversations } from "../../conversation-list/slice/conversationListSlice";

export const IconSidebar = () => {
  const [isToggleOn, setIsToggleOn] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Hàm xử lý logout
  const handleLogout = () => {
    // Xóa thông tin user và code khỏi localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("code");

    // Cập nhật Redux store trước
    dispatch(logout());
    dispatch(clearChat());
    dispatch(clearConversations());

    // Đóng kết nối WebSocket (sau khi clear state)
    // Khi login lại, App.jsx sẽ tự động reconnect
    disconnectSocket();

    // Chuyển về trang login
    navigate("/login");
  };

  return (
    <aside className={styles.container}>
      <img src="/images/logo.jpg" alt="Logo" className={styles.logo} />

      <div className={styles.icons}>
        <MessageCircle className={styles.iconActive} />
        <Users />
        <Phone />
        <Settings />
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.toggleWrapper}>
          <button
            className={`${styles.toggle} ${isToggleOn ? styles.toggleOn : ""}`}
            onClick={() => setIsToggleOn(!isToggleOn)}
            aria-label="Toggle"
          >
            <div className={styles.toggleThumb}></div>
          </button>
        </div>

        <div
          className={styles.userAvatar}
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
          title="Đăng xuất"
        >
          <div className={styles.avatarContent}>LK</div>
        </div>
      </div>
    </aside>
  );
};
