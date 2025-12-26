import {MessageCircle, Users, Phone, Settings} from "lucide-react";
import {useState} from "react";
import styles from "./IconSidebar.module.scss";
import {FaPowerOff} from "react-icons/fa";
import ConfirmModal from "../../../../components/ConfirmModal.jsx";
import {logout} from "../../../auth/services/authService.js";
import {toast} from "react-toastify";
import {processLogout} from "../../../auth/slice/authSlice.js";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

export const IconSidebar = ({onCreateGroup}) => {
    const [isToggleOn, setIsToggleOn] = useState(true);
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
                    onClick={() => setIsConfirmedOpen(true)}
                    style={{cursor: "pointer"}}
                    title="Đăng xuất"
                >
                    <FaPowerOff className={styles.logoutIcon} size={24} color="#ffffff"/>
                </div>
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
