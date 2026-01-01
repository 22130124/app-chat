import React from 'react';
import styles from "./ConfirmModal.module.scss"

function ConfirmModal({
                          isOpen,
                          onClose,
                          onConfirm,
                          title = "Xác nhận hành động",
                          message = "Bạn có chắc chắn muốn thực hiện hành động này không?",
                          confirmText = "Xác nhận",
                          cancelText = "Hủy"
                      }) {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>{title}</h2>
                </div>
                <p className={styles.modalMessage}>{message}</p>
                <div className={styles.modalButtons}>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        {cancelText}
                    </button>
                    <button
                        className={styles.confirmBtn}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;