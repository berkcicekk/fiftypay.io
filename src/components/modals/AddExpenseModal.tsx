import React, { useState } from "react"
import { Button } from "../ui/Button"
import styles from "./Modal.module.css"

interface AddExpenseModalProps {
	isOpen: boolean
	onClose: () => void
	onAddExpense: (description: string, amount: number, paidBy: string) => void
	participants: string[]
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
	isOpen,
	onClose,
	onAddExpense,
	participants,
}) => {
	const [description, setDescription] = useState("")
	const [amount, setAmount] = useState("")
	const [paidBy, setPaidBy] = useState("You")
	const [isProcessing, setIsProcessing] = useState(false)
	const [error, setError] = useState("")

	if (!isOpen) return null

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")

		if (!description.trim()) {
			setError("Description is required")
			return
		}

		const amountNum = parseFloat(amount)
		if (isNaN(amountNum) || amountNum <= 0) {
			setError("Please enter a valid amount")
			return
		}

		setIsProcessing(true)

		try {
			await new Promise((resolve) => setTimeout(resolve, 500))
			onAddExpense(description.trim(), amountNum, paidBy)

			setDescription("")
			setAmount("")
			setPaidBy("You")
			onClose()
		} catch (err) {
			setError("Failed to add expense")
		} finally {
			setIsProcessing(false)
		}
	}

	const handleClose = () => {
		if (!isProcessing) {
			setDescription("")
			setAmount("")
			setPaidBy("You")
			setError("")
			onClose()
		}
	}

	return (
		<div className={styles.overlay} onClick={handleClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<div className={styles.header}>
					<h2>Add Expense</h2>
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
							<label className={styles.label}>Description</label>
							<input
								type="text"
								className={styles.input}
								placeholder="Dinner at restaurant"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								disabled={isProcessing}
								autoFocus
							/>
						</div>

						<div className={styles.field}>
							<label className={styles.label}>Amount (XLM)</label>
							<input
								type="number"
								step="0.01"
								min="0"
								className={styles.input}
								placeholder="0.00"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								disabled={isProcessing}
							/>
						</div>

						<div className={styles.field}>
							<label className={styles.label}>Paid by</label>
							<select
								className={styles.input}
								value={paidBy}
								onChange={(e) => setPaidBy(e.target.value)}
								disabled={isProcessing}
							>
								<option value="You">You</option>
								{participants.map((p) => (
									<option key={p} value={p}>
										{p}
									</option>
								))}
							</select>
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
						<Button type="submit" variant="primary" disabled={isProcessing}>
							{isProcessing ? "Adding..." : "Add Expense"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}
