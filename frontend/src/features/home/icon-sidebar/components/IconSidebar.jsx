import {MessageCircle, Users, Phone, Settings} from "lucide-react";
import {useState} from "react";
import styles from "./IconSidebar.module.scss";
import {FaPowerOff} from "react-icons/fa";
import ConfirmModal from "../../../../components/ConfirmModal.jsx";
import {useNavigate} from "react-router-dom";
import ThemeButton from "../../../theme/components/ThemeButton.jsx";
import {FiPower} from "react-icons/fi";

export const IconSidebar = ({onCreateGroup}) => {
    const [isConfirmedOpen, setIsConfirmedOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate("/login");
    }

    return (
        <aside className={styles.container}>
            <img src="/images/logo.jpg" alt="Logo" className={styles.logo}/>

            <div className={styles.icons}>
                <MessageCircle className={styles.iconActive}/>
                {/*nhấn vào icon để tạo nhóm chat*/}
                <Users className={styles.icon} onClick={onCreateGroup}/>
                <Phone/>
                <Settings/>
            </div>

            <div className={styles.bottomSection}>
                <ThemeButton/>
                <FiPower size={20} className={styles.icon} onClick={() => setIsConfirmedOpen(true)}/>
            </div>

            <ConfirmModal
                isOpen={isConfirmedOpen}
                onClose={() => setIsConfirmedOpen(false)}
                onConfirm={handleLogout}
                title={"Xác nhận đăng xuất"}
                message={"Bạn chắc chắn muốn đăng xuất tài khoản?"}
            />
        </aside>
    );
};
