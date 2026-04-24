import * as StellarSdk from "@stellar/stellar-sdk"
import React, { useState } from "react"
import { horizonUrl, networkPassphrase } from "../../contracts/util"
import { useWallet } from "../../hooks/useWallet"
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
	const { address, signTransaction } = useWallet()
	const [isProcessing, setIsProcessing] = useState(false)
	const [step, setStep] = useState<
		"confirm" | "processing" | "success" | "error"
	>("confirm")
	const [errorMessage, setErrorMessage] = useState<string>("")

	if (!isOpen) return null

	const handlePay = async () => {
		if (!address || !toAddress) {
			setErrorMessage("Wallet address or recipient address is missing")
			setStep("error")
			return
		}

		setIsProcessing(true)
		setStep("processing")

		try {
			// Create Horizon server instance
			const server = new StellarSdk.Horizon.Server(horizonUrl)

			// Load source account
			const sourceAccount = await server.loadAccount(address)

			// Build transaction
			const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
				fee: StellarSdk.BASE_FEE,
				networkPassphrase: networkPassphrase,
			})
				.addOperation(
					StellarSdk.Operation.payment({
						destination: toAddress,
						asset: StellarSdk.Asset.native(),
						amount: amount.toString(),
					}),
				)
				.setTimeout(180)
				.build()

			// Sign transaction with wallet
			const signedXdr = await signTransaction(transaction.toXDR(), {
				networkPassphrase: networkPassphrase,
				address: address,
			})

			// Submit transaction
			const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
				signedXdr,
				networkPassphrase,
			)
			const result = await server.submitTransaction(signedTransaction)

			console.log("Payment successful:", result)
			setStep("success")

			setTimeout(() => {
				onConfirmPayment()
				handleClose()
			}, 1500)
		} catch (err) {
			console.error("Payment error:", err)
			setErrorMessage(
				err instanceof Error
					? err.message
					: "Payment failed. Please try again.",
			)
			setStep("error")
			setIsProcessing(false)
		}
	}

	const handleClose = () => {
		if (!isProcessing) {
			setStep("confirm")
			setErrorMessage("")
			onClose()
		}
	}

	const handleRetry = () => {
		setStep("confirm")
		setErrorMessage("")
		setIsProcessing(false)
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
							<p className={styles.processingNote}>
								Please confirm the transaction in your wallet
							</p>
						</div>
					)}

					{step === "success" && (
						<div className={styles.successState}>
							<div className={styles.successIcon}>✓</div>
							<p>Payment successful</p>
						</div>
					)}

					{step === "error" && (
						<div className={styles.errorState}>
							<div className={styles.errorIcon}>✕</div>
							<p>Payment failed</p>
							<p className={styles.errorMessage}>{errorMessage}</p>
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

				{step === "error" && (
					<div className={styles.footer}>
						<Button type="button" variant="secondary" onClick={handleClose}>
							Close
						</Button>
						<Button type="button" variant="primary" onClick={handleRetry}>
							Try Again
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}
