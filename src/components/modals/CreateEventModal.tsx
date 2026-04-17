import React, { useState } from "react"
import { Button } from "../ui/Button"
import styles from "./Modal.module.css"

interface CreateEventModalProps {
	isOpen: boolean
	onClose: () => void
	onCreateEvent: (name: string, date?: string, description?: string) => void
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
	isOpen,
	onClose,
	onCreateEvent,
}) => {
	const [name, setName] = useState("")
	const [date, setDate] = useState("")
	const [description, setDescription] = useState("")
	const [isProcessing, setIsProcessing] = useState(false)
	const [error, setError] = useState("")

	if (!isOpen) return null

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")

		if (!name.trim()) {
			setError("Event name is required")
			return
		}

		setIsProcessing(true)

		try {
			await new Promise((resolve) => setTimeout(resolve, 500))
			onCreateEvent(
				name.trim(),
				date || undefined,
				description.trim() || undefined,
			)

			setName("")
			setDate("")
			setDescription("")
			onClose()
		} catch (err) {
			setError("Failed to create event")
		} finally {
			setIsProcessing(false)
		}
	}

	const handleClose = () => {
		if (!isProcessing) {
			setName("")
			setDate("")
			setDescription("")
			setError("")
			onClose()
		}
	}

	return (
		<div className={styles.overlay} onClick={handleClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<div className={styles.header}>
					<h2>Create Event</h2>
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
							<label className={styles.label}>Event Name</label>
							<input
								type="text"
								className={styles.input}
								placeholder="Weekend trip"
								value={name}
								onChange={(e) => setName(e.target.value)}
								disabled={isProcessing}
								autoFocus
							/>
						</div>

						<div className={styles.field}>
							<label className={styles.label}>Date (optional)</label>
							<input
								type="date"
								className={styles.input}
								value={date}
								onChange={(e) => setDate(e.target.value)}
								disabled={isProcessing}
							/>
						</div>

						<div className={styles.field}>
							<label className={styles.label}>Description (optional)</label>
							<textarea
								className={styles.textarea}
								placeholder="Brief description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								disabled={isProcessing}
								rows={3}
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
							{isProcessing ? "Creating..." : "Create Event"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}
