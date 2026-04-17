import React from "react"
import { NavLink } from "react-router-dom"
import { useWallet } from "../hooks/useWallet"
import styles from "./AppHeader.module.css"

const AppHeader: React.FC = () => {
	const { address, connect, disconnect } = useWallet()

	const handleWalletClick = () => {
		if (address) {
			disconnect()
		} else {
			connect()
		}
	}

	const formatAddress = (addr: string) => {
		return `${addr.slice(0, 4)}...${addr.slice(-4)}`
	}

	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<NavLink to="/" className={styles.logo}>
					<span className={styles.logoText}>FiftyPay</span>
				</NavLink>

				<nav className={styles.nav}>
					<NavLink
						to="/"
						className={({ isActive }) =>
							`${styles.navLink} ${isActive ? styles.active : ""}`
						}
					>
						Dashboard
					</NavLink>
					<NavLink
						to="/debug"
						className={({ isActive }) =>
							`${styles.navLink} ${isActive ? styles.active : ""}`
						}
					>
						Debug
					</NavLink>
				</nav>

				<div className={styles.actions}>
					<button
						className={address ? styles.walletConnected : styles.walletButton}
						onClick={handleWalletClick}
					>
						{address ? formatAddress(address) : "Connect Wallet"}
					</button>
				</div>
			</div>
		</header>
	)
}

export default AppHeader
