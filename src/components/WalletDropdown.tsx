import React, { useState, useRef, useEffect } from "react"
import styles from "./WalletDropdown.module.css"

interface WalletDropdownProps {
	address: string
	onDisconnect: () => void
}

export const WalletDropdown: React.FC<WalletDropdownProps> = ({
	address,
	onDisconnect,
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [copied, setCopied] = useState(false)
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setIsOpen(false)
			}
		}
		document.addEventListener("mousedown", handleClickOutside)
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [])

	const shortAddress = `${address.slice(0, 4)}...${address.slice(-4)}`

	const handleCopy = () => {
		void navigator.clipboard.writeText(address)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<div className={styles.wrapper} ref={ref}>
			<button className={styles.pill} onClick={() => setIsOpen(!isOpen)}>
				<span className={styles.dot} />
				{shortAddress}
				<span className={styles.chevron}>{isOpen ? "▲" : "▼"}</span>
			</button>

			{isOpen && (
				<div className={styles.dropdown}>
					<div className={styles.dropdownAddress}>{shortAddress}</div>
					<div className={styles.divider} />
					<button className={styles.dropdownItem} onClick={handleCopy}>
						{copied ? "Copied!" : "Copy address"}
					</button>
					<button className={styles.dropdownItem}>Testnet</button>
					<div className={styles.divider} />
					<button
						className={`${styles.dropdownItem} ${styles.danger}`}
						onClick={() => {
							onDisconnect()
							setIsOpen(false)
						}}
					>
						Disconnect
					</button>
				</div>
			)}
		</div>
	)
}
