import React from "react"
import { NavLink } from "react-router-dom"
import { useWallet } from "../hooks/useWallet"
import styles from "./AppHeader.module.css"
import { WalletDropdown } from "./WalletDropdown"

const AppHeader: React.FC = () => {
	const { address, connect, disconnect } = useWallet()

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
					{address ? (
						<WalletDropdown address={address} onDisconnect={disconnect} />
					) : (
						<button className={styles.walletButton} onClick={connect}>
							Connect Wallet
						</button>
					)}
				</div>
			</div>
		</header>
	)
}

export default AppHeader
