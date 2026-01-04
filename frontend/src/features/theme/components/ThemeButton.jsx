import {useDispatch, useSelector} from "react-redux";
import {toggleTheme} from "../slice/themeSlice.js";
import {FiMoon, FiSun} from "react-icons/fi";
import styles from "./ThemeButton.module.scss"

const ThemeButton = () => {
    const dispatch = useDispatch();
    const theme = useSelector(state => state.theme.mode)

    return (
        <button
            onClick={() => dispatch(toggleTheme())}
            className={styles.button}
            aria-label="Toggle theme"
        >
            {theme === "dark" ? <FiMoon /> : <FiSun />}
        </button>
    );
}

export default ThemeButton;