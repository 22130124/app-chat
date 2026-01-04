import React from "react";
import {useState} from 'react';
import {toast} from "react-toastify";
import styles from "./CreateGrooup.module.scss";
export const CreateGroup = ({onClose, onCreate})=>{
    const [groupName, setGroupName] = useState("");

        const handleSubmit=()=>{
            if(!groupName.trim()){
                toast.error("Vui lòng nhập tên nhóm");
                return;
        }
            onCreate(groupName);
            toast.success("Tạo nhóm thành công");
        // test tạm chức năng tạo nhóm chat
        console.log("Tạo nhóm:", groupName);
        toast.success(`Đã tạo nhóm "${groupName}"`);
        onClose();
    };
    return(
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3>Tạo nhóm chat</h3>
                <input type="text"
                       placeholder="Nhập tên nhóm"
                       value={groupName}
                       onChange={(e)=>setGroupName(e.target.value)}/>

                <div className={styles.actions}>
                    <button onClick={onClose}>Hủy</button>
                    <button onClick={handleSubmit}>Tạo nhóm</button>

                </div>
            </div>
        </div>
    ) ;

};

