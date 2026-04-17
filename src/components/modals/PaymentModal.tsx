import React, { useState } from "react"
import { Button } from "../ui/Button"
import styles from "./Modal.module.css"

interface PaymentModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirmPayment: () => void
	from: string
	to: string
	amount: number
	toAddress?: string
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
	isOpen,
	onClose,
	onConfirmPayment,
	from,
	to,
	amount,
	toAddress,
}) => {
	const [isProcessing, setIsProcessing] = useState(false)
	const [step, setStep] = useState<"confirm" | "processing" | "success">(
		"confirm",
	)

	if (!isOpen) return null

	const handlePay = async () => {
		setIsProcessing(true)
		setStep("processing")

		try {
			await new Promise((resolve) => setTimeout(resolve, 2000))
			setStep("success")

			setTimeout(() => {
				onConfirmPayment()
				handleClose()
			}, 1500)
		} catch (err) {
			setStep("confirm")
			setIsProcessing(false)
		}
	}

	const handleClose = () => {
		if (!isProcessing) {
			setStep("confirm")
			onClose()
		}
	}

	return (
		<div className={styles.overlay} onClick={handleClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<div className={styles.header}>
					<h2>Pay with Stellar</h2>
					<button
						className={styles.closeButton}
						onClick={handleClose}
						disabled={isProcessing}
					>
						×
					</button>
				</div>

				<div className={styles.content}>
					{step === "confirm" && (
						<>
							<div className={styles.paymentDetails}>
								<div className={styles.paymentRow}>
									<span className={styles.paymentLabel}>From</span>
									<span className={styles.paymentValue}>{from}</span>
								</div>
								<div className={styles.paymentRow}>
									<span className={styles.paymentLabel}>To</span>
									<span className={styles.paymentValue}>{to}</span>
								</div>
								{toAddress && (
									<div className={styles.paymentRow}>
										<span className={styles.paymentLabel}>Address</span>
										<span className={styles.paymentAddress}>{toAddress}</span>
									</div>
								)}
								<div className={styles.paymentRow}>
									<span className={styles.paymentLabel}>Amount</span>
									<span className={styles.paymentAmount}>
										{amount.toFixed(2)} XLM
									</span>
								</div>
							</div>
							<div className={styles.infoBox}>
								<p>
									This will open your Stellar wallet to confirm the transaction
								</p>
							</div>
						</>
					)}

					{step === "processing" && (
						<div className={styles.processingState}>
							<div className={styles.spinner}></div>
							<p>Processing payment...</p>
						</div>
					)}

					{step === "success" && (
						<div className={styles.successState}>
							<div className={styles.successIcon}>✓</div>
							<p>Payment successful</p>
						</div>
					)}
				</div>

				{step === "confirm" && (
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
							type="button"
							variant="primary"
							onClick={handlePay}
							disabled={isProcessing}
						>
							Confirm Payment
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}
