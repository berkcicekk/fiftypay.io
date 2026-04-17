import React, { useState } from "react"
import { Button } from "../ui/Button"
import styles from "./Modal.module.css"

interface AddParticipantModalProps {
	isOpen: boolean
	onClose: () => void
	onAddParticipant: (name: string, stellarAddress?: string) => void
}

export const AddParticipantModal: React.FC<AddParticipantModalProps> = ({
	isOpen,
	onClose,
	onAddParticipant,
}) => {
	const [name, setName] = useState("")
	const [stellarAddress, setStellarAddress] = useState("")
	const [isProcessing, setIsProcessing] = useState(false)
	const [error, setError] = useState("")

	if (!isOpen) return null

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")

		if (!name.trim()) {
			setError("Name is required")
			return
		}

		setIsProcessing(true)

		try {
			await new Promise((resolve) => setTimeout(resolve, 500))
			onAddParticipant(name.trim(), stellarAddress.trim() || undefined)

			setName("")
			setStellarAddress("")
			onClose()
		} catch (err) {
			setError("Failed to add participant")
		} finally {
			setIsProcessing(false)
		}
	}

	const handleClose = () => {
		if (!isProcessing) {
			setName("")
			setStellarAddress("")
			setError("")
			onClose()
		}
	}

	return (
		<div className={styles.overlay} onClick={handleClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<div className={styles.header}>
					<h2>Add Participant</h2>
					<button
						className={styles.closeButton}
						onClick={handleClose}
						disabled={isProcessing}
					>
						×
					</button>
				</div>

				<form onSubmit={handleSubmit}>
					<div className={styles.content}>
						<div className={styles.field}>
							<label className={styles.label}>Name</label>
							<input
								type="text"
								className={styles.input}
								placeholder="John Doe"
								value={name}
								onChange={(e) => setName(e.target.value)}
								disabled={isProcessing}
								autoFocus
							/>
						</div>

						<div className={styles.field}>
							<label className={styles.label}>Stellar Address (optional)</label>
							<input
								type="text"
								className={styles.input}
								placeholder="GDZX..."
								value={stellarAddress}
								onChange={(e) => setStellarAddress(e.target.value)}
								disabled={isProcessing}
							/>
						</div>

						{error && <div className={styles.error}>{error}</div>}
					</div>

					<div className={styles.footer}>
						<Button
							type="button"
							variant="secondary"
							onClick={handleClose}
							disabled={isProcessing}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							variant="primary"
							disabled={isProcessing || !name.trim()}
						>
							{isProcessing ? "Adding..." : "Add Participant"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}
