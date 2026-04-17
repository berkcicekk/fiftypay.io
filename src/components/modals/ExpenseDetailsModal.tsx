import React, { useState } from "react"
import { Button } from "../ui/Button"
import styles from "./Modal.module.css"

interface Expense {
	id: string
	description: string
	amount: number
	paidBy: string
	splitBetween: string[]
	date: string
	note?: string
	receiptFileName?: string
}

interface ExpenseDetailsModalProps {
	isOpen: boolean
	onClose: () => void
	expense: Expense | null
	onDelete: (id: string) => void
}

export const ExpenseDetailsModal: React.FC<ExpenseDetailsModalProps> = ({
	isOpen,
	onClose,
	expense,
	onDelete,
}) => {
	const [confirmDelete, setConfirmDelete] = useState(false)

	if (!isOpen || !expense) return null

	const perPerson =
		expense.splitBetween.length > 0
			? expense.amount / expense.splitBetween.length
			: expense.amount

	const handleDelete = () => {
		if (confirmDelete) {
			onDelete(expense.id)
			setConfirmDelete(false)
			onClose()
		} else {
			setConfirmDelete(true)
		}
	}

	const handleClose = () => {
		setConfirmDelete(false)
		onClose()
	}

	return (
		<div className={styles.overlay} onClick={handleClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<div className={styles.header}>
					<h2>Expense Details</h2>
					<button className={styles.closeButton} onClick={handleClose}>
						×
					</button>
				</div>

				<div className={styles.content}>
					<div className={styles.expenseDetailTitle}>{expense.description}</div>
					<div className={styles.expenseDetailAmount}>
						{expense.amount.toFixed(2)} XLM
					</div>

					<div className={styles.paymentDetails}>
						<div className={styles.paymentRow}>
							<span className={styles.paymentLabel}>Paid by</span>
							<span className={styles.paymentValue}>{expense.paidBy}</span>
						</div>
						<div className={styles.paymentRow}>
							<span className={styles.paymentLabel}>Date</span>
							<span className={styles.paymentValue}>{expense.date}</span>
						</div>
						<div className={styles.paymentRow}>
							<span className={styles.paymentLabel}>Split between</span>
							<span className={styles.paymentValue}>
								{expense.splitBetween.join(", ")}
							</span>
						</div>
						<div className={styles.paymentRow}>
							<span className={styles.paymentLabel}>Per person</span>
							<span className={styles.paymentAmount}>
								{perPerson.toFixed(2)} XLM
							</span>
						</div>
						{expense.note && (
							<div className={styles.paymentRow}>
								<span className={styles.paymentLabel}>Note</span>
								<span className={styles.paymentValue}>{expense.note}</span>
							</div>
						)}
						{expense.receiptFileName && (
							<div className={styles.paymentRow}>
								<span className={styles.paymentLabel}>Receipt</span>
								<span className={styles.paymentValue}>
									{expense.receiptFileName}
								</span>
							</div>
						)}
					</div>
				</div>

				<div className={styles.footer}>
					<Button
						type="button"
						variant="secondary"
						onClick={handleDelete}
						className={confirmDelete ? styles.dangerButton : ""}
					>
						{confirmDelete ? "Confirm Delete" : "Delete"}
					</Button>
					<Button type="button" variant="primary" onClick={handleClose}>
						Close
					</Button>
				</div>
			</div>
		</div>
	)
}
