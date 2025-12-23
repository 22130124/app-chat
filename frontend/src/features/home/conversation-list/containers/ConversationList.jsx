import styles from "./ConversationList.module.scss";
import { Search } from "lucide-react";
import { ConversationItem } from "../components/ConversationItem.jsx";

export const ConversationList = ({groups=[]}) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Tin nhắn</h2>
      </div>

      <div className={styles.searchBox}>
        <Search className={styles.searchIcon} size={18} />
        <input
          type="text"
          placeholder="Tìm kiếm cuộc trò chuyện..."
          className={styles.searchInput}
        />
      </div>

      <div className={styles.list}>
        {[1, 2].map((u) => (
          <ConversationItem
            key={u}
            name={`Cuộc trò chuyện ${u}`}
            lastMessage="Tin nhắn gần nhất"
            time="2h"
            avatarContent={u}
          />
        ))}
          {/*thêm chat nhóm*/}
          {groups.map((group)=>(
              <ConversationItem
              key={`group-${group.id}`}
              name={group.name}
              lastMessage={group.lastMessage}
              time={group.time || "Vừa xong"}
              avatarContent={group.avatarContent}
              />
          ))}
      </div>
    </div>
  );
};


