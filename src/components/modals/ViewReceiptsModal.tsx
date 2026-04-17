import React from "react"
import { type StoredReceipt } from "../../utils/localStorage"
import { Button } from "../ui/Button"
import styles from "./Modal.module.css"

interface ViewReceiptsModalProps {
	isOpen: boolean
	onClose: () => void
	receipts: StoredReceipt[]
	onLinkToExpense: (receiptId: string) => void
}

export const ViewReceiptsModal: React.FC<ViewReceiptsModalProps> = ({
	isOpen,
	onClose,
	receipts,
	onLinkToExpense,
}) => {
	if (!isOpen) return null

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		const now = new Date()
		const diffMs = now.getTime() - date.getTime()
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

		if (diffDays === 0) return "Today"
		if (diffDays === 1) return "Yesterday"
		if (diffDays < 7) return `${diffDays} days ago`
		return date.toLocaleDateString()
	}

	const formatFileSize = (bytes: number): string => {
		if (bytes < 1024) return bytes + " B"
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
		return (bytes / (1024 * 1024)).toFixed(1) + " MB"
	}

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<div className={styles.header}>
					<h2>All Receipts</h2>
					<button className={styles.closeButton} onClick={onClose}>
						×
					</button>
				</div>

				<div className={styles.content}>
					{receipts.length === 0 ? (
						<div className={styles.emptyState}>
							<p>No receipts uploaded yet</p>
						</div>
					) : (
						<div className={styles.receiptList}>
							{receipts.map((receipt) => (
								<div key={receipt.id} className={styles.receiptItem}>
									<div className={styles.receiptInfo}>
										<div className={styles.receiptName}>{receipt.fileName}</div>
										<div className={styles.receiptMeta}>
											{formatFileSize(receipt.fileSize)} ·{" "}
											{formatDate(receipt.uploadedAt)}
										</div>
									</div>
									<Button
										size="small"
										variant="ghost"
										onClick={() => onLinkToExpense(receipt.id)}
									>
										Link to Expense
									</Button>
								</div>
							))}
						</div>
					)}
				</div>

				<div className={styles.footer}>
					<Button type="button" variant="secondary" onClick={onClose}>
						Close
					</Button>
				</div>
			</div>
		</div>
	)
}
