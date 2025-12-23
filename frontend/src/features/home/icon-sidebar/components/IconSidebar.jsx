import { MessageCircle, Users, Phone, Settings } from "lucide-react";
import { useState } from "react";
import styles from "./IconSidebar.module.scss";

// export const IconSidebar = () => {
//   const [isToggleOn, setIsToggleOn] = useState(true);

  export const IconSidebar = ({ onCreateGroup }) => {
    const [isToggleOn, setIsToggleOn] = useState(true);

    return (
    <aside className={styles.container}>
      <img src="/images/logo.jpg" alt="Logo" className={styles.logo} />

      <div className={styles.icons}>
        <MessageCircle className={styles.iconActive} />
          {/*nhấn vào icon để tạo nhóm chat*/}
        <Users className={styles.icon} onClick={onCreateGroup} />
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

        <div className={styles.userAvatar}>
          <div className={styles.avatarContent}>LK</div>
        </div>
      </div>
    </aside>
  );
};
