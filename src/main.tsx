import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./assets/index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<Router basename="/logo_game">
		<App />
	</Router>
);
