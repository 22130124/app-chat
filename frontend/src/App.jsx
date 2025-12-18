import {BrowserRouter} from "react-router-dom";
import {AppRoutes} from "./routes/AppRoutes.jsx";
import {ToastContainer} from "react-toastify";

function App() {
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