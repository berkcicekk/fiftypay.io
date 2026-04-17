import { Routes, Route } from "react-router-dom"
import AppHeader from "./components/AppHeader"
import Dashboard from "./pages/Dashboard"
import Debug from "./pages/Debug"
import Home from "./pages/Home"

function App() {
	return (
		<div style={{ background: "#0B0B0F", minHeight: "100vh" }}>
			<AppHeader />
			<Routes>
				<Route path="/" element={<Dashboard />} />
				<Route path="/home" element={<Home />} />
				<Route path="/debug" element={<Debug />} />
				<Route path="/debug/:contractName" element={<Debug />} />
			</Routes>
		</div>
	)
}

export default App
