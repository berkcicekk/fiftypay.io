import React, { useState, useEffect } from "react"
import { AddExpenseModal } from "../components/modals/AddExpenseModal"
import { AddParticipantModal } from "../components/modals/AddParticipantModal"
import { CreateEventModal } from "../components/modals/CreateEventModal"
import { ExpenseDetailsModal } from "../components/modals/ExpenseDetailsModal"
import { PaymentModal } from "../components/modals/PaymentModal"
import { UploadReceiptModal } from "../components/modals/UploadReceiptModal"
import { ViewReceiptsModal } from "../components/modals/ViewReceiptsModal"
import { Button } from "../components/ui/Button"
import { Card, CardHeader, CardContent } from "../components/ui/Card"
import {
	saveGroup,
	saveExpense,
	saveReceipt,
	saveParticipant,
	getReceipts,
} from "../utils/localStorage"
import styles from "./Dashboard.module.css"

interface Group {
	id: string
	name: string
	totalExpenses: number
	participantCount: number
}

interface Settlement {
	from: string
	to: string
	amount: number
	type: "pay" | "receive"
	toAddress?: string
}

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

interface Participant {
	name: string
	stellarAddress?: string
}

interface Receipt {
	id: string
	fileName: string
	uploadedAt: string
	fileSize: number
}

const Dashboard: React.FC = () => {
	const [selectedGroup, setSelectedGroup] = useState<Group>({
		id: "1",
		name: "Antalya Trip",
		totalExpenses: 1250.5,
		participantCount: 4,
	})

	const [paymentTab, setPaymentTab] = useState<"pay" | "receive">("pay")

	const [settlementsToPayData, setSettlementsToPayData] = useState<
		Settlement[]
	>([
		{
			from: "You",
			to: "Alice",
			amount: 50.0,
			type: "pay",
			toAddress: "GDZX...3K7M",
		},
	])

	const [settlementsToReceiveData, setSettlementsToReceiveData] = useState<
		Settlement[]
	>([
		{ from: "Bob", to: "You", amount: 150.0, type: "receive" },
		{ from: "Charlie", to: "You", amount: 170.0, type: "receive" },
	])

	const [recentExpenses, setRecentExpenses] = useState<Expense[]>([
		{
			id: "1",
			description: "Hotel booking",
			amount: 450.0,
			paidBy: "You",
			splitBetween: ["You", "Alice", "Bob", "Charlie"],
			date: "2 days ago",
		},
		{
			id: "2",
			description: "Restaurant dinner",
			amount: 180.5,
			paidBy: "Alice",
			splitBetween: ["You", "Alice", "Bob", "Charlie"],
			date: "3 days ago",
		},
		{
			id: "3",
			description: "Car rental",
			amount: 320.0,
			paidBy: "Bob",
			splitBetween: ["You", "Alice", "Bob", "Charlie"],
			date: "5 days ago",
		},
	])

	const [participants, setParticipants] = useState<Participant[]>([
		{ name: "Alice", stellarAddress: "GDZX...3K7M" },
		{ name: "Bob" },
		{ name: "Charlie" },
	])

	const [receipts, setReceipts] = useState<Receipt[]>([])

	// Modal states
	const [isCreateEventOpen, setIsCreateEventOpen] = useState(false)
	const [isUploadReceiptOpen, setIsUploadReceiptOpen] = useState(false)
	const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
	const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false)
	const [isViewReceiptsOpen, setIsViewReceiptsOpen] = useState(false)
	const [paymentModal, setPaymentModal] = useState<{
		isOpen: boolean
		settlement?: Settlement
	}>({ isOpen: false })
	const [expenseDetail, setExpenseDetail] = useState<{
		isOpen: boolean
		expense?: Expense
	}>({ isOpen: false })

	useEffect(() => {
		const stored = getReceipts()
		setReceipts(
			stored.map((r) => ({
				id: r.id,
				fileName: r.fileName,
				uploadedAt: r.uploadedAt,
				fileSize: r.fileSize,
			})),
		)
	}, [])

	// Derived: settlement progress
	const totalSettlements =
		settlementsToPayData.length + settlementsToReceiveData.length
	const completedSettlements = 1 // mock: 1 already done
	const progressPct =
		totalSettlements > 0
			? Math.round(
					(completedSettlements / (totalSettlements + completedSettlements)) *
						100,
				)
			: 100

	const handleCreateEvent = (
		name: string,
		date?: string,
		description?: string,
	) => {
		const newGroup = {
			id: Date.now().toString(),
			name,
			description,
			date,
			createdAt: new Date().toISOString(),
			participantIds: [],
		}
		saveGroup(newGroup)
		setSelectedGroup({
			id: newGroup.id,
			name: newGroup.name,
			totalExpenses: 0,
			participantCount: 0,
		})
	}

	const handleUploadReceipt = (file: File, previewUrl?: string) => {
		const receipt = {
			id: Date.now().toString(),
			fileName: file.name,
			fileType: file.type,
			fileSize: file.size,
			uploadedAt: new Date().toISOString(),
			previewUrl,
		}
		saveReceipt(receipt)
		setReceipts((prev) => [
			{
				id: receipt.id,
				fileName: receipt.fileName,
				uploadedAt: receipt.uploadedAt,
				fileSize: receipt.fileSize,
			},
			...prev,
		])
	}

	const handleAddExpense = (
		description: string,
		amount: number,
		paidBy: string,
	) => {
		const splitBetween = ["You", ...participants.map((p) => p.name)]
		const newExpense = {
			id: Date.now().toString(),
			groupId: selectedGroup.id,
			description,
			amount,
			paidBy,
			splitBetween,
			date: new Date().toISOString(),
			settled: false,
		}
		saveExpense(newExpense)
		setRecentExpenses((prev) => [
			{
				id: newExpense.id,
				description,
				amount,
				paidBy,
				splitBetween,
				date: "Just now",
			},
			...prev,
		])
		setSelectedGroup((prev) => ({
			...prev,
			totalExpenses: prev.totalExpenses + amount,
		}))
	}

	const handleAddParticipant = (name: string, stellarAddress?: string) => {
		saveParticipant({ id: Date.now().toString(), name, stellarAddress })
		setParticipants((prev) => [...prev, { name, stellarAddress }])
		setSelectedGroup((prev) => ({
			...prev,
			participantCount: prev.participantCount + 1,
		}))
	}

	const handlePayment = (settlement: Settlement) => {
		setPaymentModal({ isOpen: true, settlement })
	}

	const handleMarkAsPaid = (settlement: Settlement) => {
		if (settlement.type === "pay") {
			setSettlementsToPayData((prev) => prev.filter((s) => s !== settlement))
		} else {
			setSettlementsToReceiveData((prev) =>
				prev.map((s) => (s === settlement ? { ...s, settled: true } : s)),
			)
		}
	}

	const handleConfirmPayment = () => {
		if (paymentModal.settlement) {
			setSettlementsToPayData((prev) =>
				prev.filter((s) => s !== paymentModal.settlement),
			)
		}
		setPaymentModal({ isOpen: false })
	}

	const handleDeleteExpense = (id: string) => {
		setRecentExpenses((prev) => prev.filter((e) => e.id !== id))
	}

	const handleLinkToExpense = (_receiptId: string) => {
		setIsViewReceiptsOpen(false)
		setIsAddExpenseOpen(true)
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		const diffDays = Math.floor((Date.now() - date.getTime()) / 86400000)
		if (diffDays === 0) return "Today"
		if (diffDays === 1) return "Yesterday"
		if (diffDays < 7) return `${diffDays} days ago`
		return date.toLocaleDateString()
	}

	const currentSettlements =
		paymentTab === "pay" ? settlementsToPayData : settlementsToReceiveData
	const participantNames = participants.map((p) => p.name)

	return (
		<div className={styles.dashboard}>
			<div className={styles.grid}>
				{/* Group Summary */}
				<div className={styles.groupSummary}>
					<Card variant="highlight" size="large">
						<CardHeader
							title={selectedGroup.name}
							subtitle={`${selectedGroup.participantCount} participants`}
						/>
						<CardContent>
							<div className={styles.summaryStats}>
								<div className={styles.stat}>
									<span className={styles.statLabel}>Total Expenses</span>
									<span className={styles.statValue}>
										{selectedGroup.totalExpenses.toFixed(2)} XLM
									</span>
								</div>
								<div className={styles.stat}>
									<span className={styles.statLabel}>Your Share</span>
									<span className={styles.statValue}>
										{selectedGroup.participantCount > 0
											? (
													selectedGroup.totalExpenses /
													selectedGroup.participantCount
												).toFixed(2)
											: "0.00"}{" "}
										XLM
									</span>
								</div>
							</div>

							{/* Progress bar — item 7 */}
							<div className={styles.progressSection}>
								<div className={styles.progressLabel}>
									<span>
										{completedSettlements} of{" "}
										{completedSettlements + totalSettlements} payments completed
									</span>
									<span>{progressPct}%</span>
								</div>
								<div className={styles.progressTrack}>
									<div
										className={styles.progressFill}
										style={{ width: `${progressPct}%` }}
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Net Balance */}
				<div className={styles.netBalance}>
					<Card variant="accent" size="large">
						<CardContent>
							<div className={styles.balanceContent}>
								<span className={styles.balanceLabel}>You are owed</span>
								<span className={styles.balanceAmount}>320.00 XLM</span>
								<span className={styles.balanceNote}>
									Waiting for settlements
								</span>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Pending Payments */}
				<div className={styles.settlements}>
					<Card size="large">
						<CardHeader title="Pending Payments" />
						<CardContent>
							<div className={styles.paymentTabs}>
								<button
									className={`${styles.paymentTab} ${paymentTab === "pay" ? styles.activeTab : ""}`}
									onClick={() => setPaymentTab("pay")}
								>
									I will pay
								</button>
								<button
									className={`${styles.paymentTab} ${paymentTab === "receive" ? styles.activeTab : ""}`}
									onClick={() => setPaymentTab("receive")}
								>
									I will receive
								</button>
							</div>

							{currentSettlements.length > 0 ? (
								<div className={styles.settlementList}>
									{currentSettlements.map((settlement, index) => (
										<div key={index} className={styles.settlementItem}>
											<div className={styles.settlementInfo}>
												<span className={styles.settlementFrom}>
													{settlement.from}
												</span>
												<span className={styles.settlementArrow}>→</span>
												<span className={styles.settlementTo}>
													{settlement.to}
												</span>
											</div>
											<div className={styles.settlementAction}>
												<span className={styles.settlementAmount}>
													{settlement.amount.toFixed(2)} XLM
												</span>
												{paymentTab === "pay" ? (
													<div className={styles.settlementButtons}>
														{settlement.toAddress ? (
															<Button
																size="small"
																variant="primary"
																onClick={() => handlePayment(settlement)}
															>
																Pay
															</Button>
														) : (
															<Button
																size="small"
																variant="secondary"
																onClick={() => setIsAddParticipantOpen(true)}
															>
																Add wallet
															</Button>
														)}
														<Button
															size="small"
															variant="ghost"
															onClick={() => handleMarkAsPaid(settlement)}
														>
															Mark paid
														</Button>
													</div>
												) : (
													<span className={styles.statusBadge}>Waiting</span>
												)}
											</div>
										</div>
									))}
								</div>
							) : (
								<div className={styles.emptyState}>
									<p>No pending payments</p>
									<Button
										size="small"
										variant="secondary"
										onClick={() => setIsAddExpenseOpen(true)}
									>
										Add expense
									</Button>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Recent Expenses */}
				<div className={styles.expenses}>
					<Card size="large">
						<CardHeader
							title="Recent Expenses"
							action={
								<Button
									size="small"
									variant="primary"
									onClick={() => setIsAddExpenseOpen(true)}
								>
									+ Add
								</Button>
							}
						/>
						<CardContent>
							<div className={styles.expenseList}>
								{recentExpenses.slice(0, 5).map((expense) => (
									<div
										key={expense.id}
										className={styles.expenseItem}
										onClick={() => setExpenseDetail({ isOpen: true, expense })}
									>
										<div className={styles.expenseInfo}>
											<span className={styles.expenseDescription}>
												{expense.description}
											</span>
											<span className={styles.expenseMeta}>
												Paid by {expense.paidBy} · {expense.date}
											</span>
										</div>
										<span className={styles.expenseAmount}>
											{expense.amount.toFixed(2)} XLM
										</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Quick Actions */}
				<div className={styles.actions}>
					<Card size="medium">
						<CardHeader title="Quick Actions" />
						<CardContent>
							<div className={styles.actionGrid}>
								<button
									className={styles.actionCard}
									onClick={() => setIsCreateEventOpen(true)}
								>
									<div className={styles.actionIcon}>
										<svg
											width="22"
											height="22"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<rect x="3" y="4" width="18" height="18" rx="2" />
											<line x1="16" y1="2" x2="16" y2="6" />
											<line x1="8" y1="2" x2="8" y2="6" />
											<line x1="3" y1="10" x2="21" y2="10" />
											<line x1="12" y1="14" x2="12" y2="18" />
											<line x1="10" y1="16" x2="14" y2="16" />
										</svg>
									</div>
									<span className={styles.actionLabel}>Create Event</span>
								</button>

								<button
									className={styles.actionCard}
									onClick={() => setIsAddExpenseOpen(true)}
								>
									<div className={styles.actionIcon}>
										<svg
											width="22"
											height="22"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<line x1="12" y1="1" x2="12" y2="23" />
											<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
										</svg>
									</div>
									<span className={styles.actionLabel}>Add Expense</span>
								</button>

								<button
									className={styles.actionCard}
									onClick={() => setIsUploadReceiptOpen(true)}
								>
									<div className={styles.actionIcon}>
										<svg
											width="22"
											height="22"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
											<polyline points="17 8 12 3 7 8" />
											<line x1="12" y1="3" x2="12" y2="15" />
										</svg>
									</div>
									<span className={styles.actionLabel}>Upload Receipt</span>
								</button>

								<button
									className={styles.actionCard}
									onClick={() => setIsAddParticipantOpen(true)}
								>
									<div className={styles.actionIcon}>
										<svg
											width="22"
											height="22"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
											<circle cx="12" cy="7" r="4" />
											<line x1="19" y1="8" x2="19" y2="14" />
											<line x1="22" y1="11" x2="16" y2="11" />
										</svg>
									</div>
									<span className={styles.actionLabel}>Add Participant</span>
								</button>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Participants */}
				<div className={styles.participantsCard}>
					<Card size="medium">
						<CardHeader
							title="Participants"
							action={
								<Button
									size="small"
									variant="ghost"
									onClick={() => setIsAddParticipantOpen(true)}
								>
									+ Add
								</Button>
							}
						/>
						<CardContent>
							<div className={styles.participantList}>
								{participants.slice(0, 5).map((p, i) => (
									<div key={i} className={styles.participantItem}>
										<div className={styles.participantAvatar}>
											{p.name.charAt(0).toUpperCase()}
										</div>
										<div className={styles.participantInfo}>
											<span className={styles.participantName}>{p.name}</span>
											{p.stellarAddress ? (
												<span className={styles.participantAddress}>
													{p.stellarAddress}
												</span>
											) : (
												<button
													className={styles.addWalletLink}
													onClick={() => setIsAddParticipantOpen(true)}
												>
													Add wallet
												</button>
											)}
										</div>
										<span
											className={`${styles.walletBadge} ${p.stellarAddress ? styles.walletLinked : styles.walletMissing}`}
										>
											{p.stellarAddress ? "Linked" : "Missing"}
										</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Receipts */}
				<div className={styles.receipts}>
					<Card size="medium">
						<CardHeader
							title="Receipts"
							action={
								<div className={styles.receiptHeaderActions}>
									<Button
										size="small"
										variant="ghost"
										onClick={() => setIsViewReceiptsOpen(true)}
									>
										View all
									</Button>
									<Button
										size="small"
										variant="secondary"
										onClick={() => setIsUploadReceiptOpen(true)}
									>
										Upload
									</Button>
								</div>
							}
						/>
						<CardContent>
							{receipts.length > 0 ? (
								<div className={styles.receiptList}>
									{receipts.slice(0, 3).map((receipt) => (
										<div key={receipt.id} className={styles.receiptItem}>
											<div className={styles.receiptInfo}>
												<span className={styles.receiptName}>
													{receipt.fileName}
												</span>
												<span className={styles.receiptDate}>
													{formatDate(receipt.uploadedAt)}
												</span>
											</div>
											<Button
												size="small"
												variant="ghost"
												onClick={() => handleLinkToExpense(receipt.id)}
											>
												Link
											</Button>
										</div>
									))}
								</div>
							) : (
								<div className={styles.emptyState}>
									<p>No receipts yet</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Modals */}
			<CreateEventModal
				isOpen={isCreateEventOpen}
				onClose={() => setIsCreateEventOpen(false)}
				onCreateEvent={handleCreateEvent}
			/>
			<UploadReceiptModal
				isOpen={isUploadReceiptOpen}
				onClose={() => setIsUploadReceiptOpen(false)}
				onUploadReceipt={handleUploadReceipt}
			/>
			<AddExpenseModal
				isOpen={isAddExpenseOpen}
				onClose={() => setIsAddExpenseOpen(false)}
				onAddExpense={handleAddExpense}
				participants={participantNames}
			/>
			<AddParticipantModal
				isOpen={isAddParticipantOpen}
				onClose={() => setIsAddParticipantOpen(false)}
				onAddParticipant={handleAddParticipant}
			/>
			<ViewReceiptsModal
				isOpen={isViewReceiptsOpen}
				onClose={() => setIsViewReceiptsOpen(false)}
				receipts={receipts.map((r) => ({
					id: r.id,
					fileName: r.fileName,
					fileType: "",
					fileSize: r.fileSize,
					uploadedAt: r.uploadedAt,
				}))}
				onLinkToExpense={handleLinkToExpense}
			/>
			<PaymentModal
				isOpen={paymentModal.isOpen}
				onClose={() => setPaymentModal({ isOpen: false })}
				onConfirmPayment={handleConfirmPayment}
				from={paymentModal.settlement?.from || ""}
				to={paymentModal.settlement?.to || ""}
				amount={paymentModal.settlement?.amount || 0}
				toAddress={paymentModal.settlement?.toAddress}
			/>
			<ExpenseDetailsModal
				isOpen={expenseDetail.isOpen}
				onClose={() => setExpenseDetail({ isOpen: false })}
				expense={expenseDetail.expense || null}
				onDelete={handleDeleteExpense}
			/>
		</div>
	)
}

export default Dashboard
