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
					<img
						src="/logo.png"
						alt="FiftyPay Logo"
						className={styles.logoImage}
					/>
					<span className={styles.logoText}>
						<span className={styles.logoLight}>fifty</span>
						<span className={styles.logoBold}>pay</span>
					</span>
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
