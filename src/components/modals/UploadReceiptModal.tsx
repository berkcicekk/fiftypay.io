import React, { useState, useRef } from "react"
import { Button } from "../ui/Button"
import styles from "./Modal.module.css"

interface UploadReceiptModalProps {
	isOpen: boolean
	onClose: () => void
	onUploadReceipt: (file: File, previewUrl?: string) => void
}

export const UploadReceiptModal: React.FC<UploadReceiptModalProps> = ({
	isOpen,
	onClose,
	onUploadReceipt,
}) => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [isProcessing, setIsProcessing] = useState(false)
	const [error, setError] = useState("")
	const fileInputRef = useRef<HTMLInputElement>(null)

	if (!isOpen) return null

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		const maxSize = 5 * 1024 * 1024
		if (file.size > maxSize) {
			setError("File size must be less than 5MB")
			return
		}

		setError("")
		setSelectedFile(file)

		if (file.type.startsWith("image/")) {
			const url = URL.createObjectURL(file)
			setPreviewUrl(url)
		} else {
			setPreviewUrl(null)
		}
	}

	const handleUpload = async () => {
		if (!selectedFile) return

		setIsProcessing(true)
		setError("")

		try {
			await new Promise((resolve) => setTimeout(resolve, 800))
			onUploadReceipt(selectedFile, previewUrl || undefined)
			handleClose()
		} catch (err) {
			setError("Failed to upload receipt")
		} finally {
			setIsProcessing(false)
		}
	}

	const handleClose = () => {
		if (!isProcessing) {
			setSelectedFile(null)
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl)
			}
			setPreviewUrl(null)
			setError("")
			onClose()
		}
	}

	const formatFileSize = (bytes: number): string => {
		if (bytes < 1024) return bytes + " B"
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
		return (bytes / (1024 * 1024)).toFixed(1) + " MB"
	}

	return (
		<div className={styles.overlay} onClick={handleClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<div className={styles.header}>
					<h2>Upload Receipt</h2>
					<button
						className={styles.closeButton}
						onClick={handleClose}
						disabled={isProcessing}
					>
						×
					</button>
				</div>

				<div className={styles.content}>
					<div className={styles.field}>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*,.pdf"
							onChange={handleFileSelect}
							disabled={isProcessing}
							style={{ display: "none" }}
						/>

						{!selectedFile ? (
							<div
								className={styles.uploadArea}
								onClick={() => fileInputRef.current?.click()}
							>
								<div className={styles.uploadIcon}>📄</div>
								<p className={styles.uploadText}>Click to select receipt</p>
								<p className={styles.uploadHint}>Images or PDF, max 5MB</p>
							</div>
						) : (
							<div className={styles.filePreview}>
								{previewUrl && (
									<img
										src={previewUrl}
										alt="Receipt preview"
										className={styles.previewImage}
									/>
								)}
								<div className={styles.fileInfo}>
									<div className={styles.fileName}>{selectedFile.name}</div>
									<div className={styles.fileMeta}>
										{selectedFile.type} · {formatFileSize(selectedFile.size)}
									</div>
								</div>
								<Button
									variant="ghost"
									size="small"
									onClick={() => fileInputRef.current?.click()}
									disabled={isProcessing}
								>
									Change
								</Button>
							</div>
						)}
					</div>

					{selectedFile && (
						<div className={styles.infoBox}>
							<p>You can add this receipt to an expense after uploading</p>
						</div>
					)}

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
						type="button"
						variant="primary"
						onClick={handleUpload}
						disabled={!selectedFile || isProcessing}
					>
						{isProcessing ? "Uploading..." : "Upload Receipt"}
					</Button>
				</div>
			</div>
		</div>
	)
}
