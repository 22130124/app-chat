import {BrowserRouter} from "react-router-dom";
import {AppRoutes} from "./routes/AppRoutes.jsx";
import {ToastContainer} from "react-toastify";
import {connectSocket} from "./socket/socket.js";
import {useEffect} from "react";
import {handleAuthResponse} from "./features/auth/services/authService.js";

function App() {
    // Kết nối socket khi khởi động hệ thống
    useEffect(() => {
        connectSocket((data) => {
            handleAuthResponse(data);
        });
    }, []);

    return (
        <BrowserRouter>
            <div className="App">
                <AppRoutes/>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    pauseOnHover
                />

            </div>
        </BrowserRouter>
    );
}

export default App;