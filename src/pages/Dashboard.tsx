import React, { useState, useEffect } from "react"
import { AddExpenseModal } from "../components/modals/AddExpenseModal"
import { AddParticipantModal } from "../components/modals/AddParticipantModal"
import { CreateEventModal } from "../components/modals/CreateEventModal"
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
	getGroups,
	getExpenses,
	getReceipts,
	getParticipants,
} from "../utils/localStorage"
import styles from "./Dashboard.module.css"

interface Group {
	id: string
	name: string
	totalExpenses: number
	participantCount: number
}

interface Balance {
	amount: number
	type: "owe" | "owed"
}

interface Settlement {
	from: string
	to: string
	amount: number
	type: "pay" | "receive"
}

interface Expense {
	id: string
	description: string
	amount: number
	paidBy: string
	date: string
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

	const [balance] = useState<Balance>({
		amount: 320.0,
		type: "owed",
	})

	const [paymentTab, setPaymentTab] = useState<"pay" | "receive">("pay")

	const [settlementsToPayData] = useState<Settlement[]>([
		{ from: "You", to: "Alice", amount: 50.0, type: "pay" },
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
			date: "2 days ago",
		},
		{
			id: "2",
			description: "Restaurant dinner",
			amount: 180.5,
			paidBy: "Alice",
			date: "3 days ago",
		},
		{
			id: "3",
			description: "Car rental",
			amount: 320.0,
			paidBy: "Bob",
			date: "5 days ago",
		},
	])

	const [participants, setParticipants] = useState<string[]>([
		"Alice",
		"Bob",
		"Charlie",
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
	}>({
		isOpen: false,
	})

	useEffect(() => {
		const storedReceipts = getReceipts()
		setReceipts(
			storedReceipts.map((r) => ({
				id: r.id,
				fileName: r.fileName,
				uploadedAt: r.uploadedAt,
				fileSize: r.fileSize,
			})),
		)
	}, [])

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

		setReceipts([
			{
				id: receipt.id,
				fileName: receipt.fileName,
				uploadedAt: receipt.uploadedAt,
				fileSize: receipt.fileSize,
			},
			...receipts,
		])
	}

	const handleAddExpense = (
		description: string,
		amount: number,
		paidBy: string,
	) => {
		const newExpense = {
			id: Date.now().toString(),
			groupId: selectedGroup.id,
			description,
			amount,
			paidBy,
			splitBetween: ["You", ...participants],
			date: new Date().toISOString(),
			settled: false,
		}

		saveExpense(newExpense)

		const expenseForDisplay: Expense = {
			id: newExpense.id,
			description: newExpense.description,
			amount: newExpense.amount,
			paidBy: newExpense.paidBy,
			date: "Just now",
		}

		setRecentExpenses([expenseForDisplay, ...recentExpenses])

		setSelectedGroup({
			...selectedGroup,
			totalExpenses: selectedGroup.totalExpenses + amount,
		})
	}

	const handleAddParticipant = (name: string, stellarAddress?: string) => {
		const newParticipant = {
			id: Date.now().toString(),
			name,
			stellarAddress,
		}

		saveParticipant(newParticipant)
		setParticipants([...participants, name])

		setSelectedGroup({
			...selectedGroup,
			participantCount: selectedGroup.participantCount + 1,
		})
	}

	const handlePayment = (settlement: Settlement) => {
		setPaymentModal({ isOpen: true, settlement })
	}

	const handleConfirmPayment = () => {
		if (paymentModal.settlement) {
			setSettlementsToReceiveData(
				settlementsToReceiveData.filter((s) => s !== paymentModal.settlement),
			)
		}
		setPaymentModal({ isOpen: false })
	}

	const handleLinkToExpense = (receiptId: string) => {
		setIsViewReceiptsOpen(false)
		setIsAddExpenseOpen(true)
	}

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

	const currentSettlements =
		paymentTab === "pay" ? settlementsToPayData : settlementsToReceiveData

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
						</CardContent>
					</Card>
				</div>

				{/* Net Balance */}
				<div className={styles.netBalance}>
					<Card variant="accent" size="large">
						<CardContent>
							<div className={styles.balanceContent}>
								<span className={styles.balanceLabel}>
									{balance.type === "owed" ? "You are owed" : "You owe"}
								</span>
								<span className={styles.balanceAmount}>
									{balance.amount.toFixed(2)} XLM
								</span>
								<span className={styles.balanceNote}>
									{balance.type === "owed"
										? "Waiting for settlements"
										: "Ready to settle"}
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
													<Button
														size="small"
														variant="primary"
														onClick={() => handlePayment(settlement)}
													>
														Pay
													</Button>
												) : (
													<span className={styles.statusBadge}>Waiting</span>
												)}
											</div>
										</div>
									))}
								</div>
							) : (
								<div className={styles.emptyState}>
									<p>All settled up</p>
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
									variant="ghost"
									onClick={() => setIsAddExpenseOpen(true)}
								>
									View All
								</Button>
							}
						/>
						<CardContent>
							<div className={styles.expenseList}>
								{recentExpenses.slice(0, 5).map((expense) => (
									<div key={expense.id} className={styles.expenseItem}>
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
									<div className={styles.actionIcon}>+</div>
									<span className={styles.actionLabel}>Create Event</span>
								</button>

								<button
									className={styles.actionCard}
									onClick={() => setIsAddExpenseOpen(true)}
								>
									<div className={styles.actionIcon}>$</div>
									<span className={styles.actionLabel}>Add Expense</span>
								</button>

								<button
									className={styles.actionCard}
									onClick={() => setIsUploadReceiptOpen(true)}
								>
									<div className={styles.actionIcon}>↑</div>
									<span className={styles.actionLabel}>Upload Receipt</span>
								</button>

								<button
									className={styles.actionCard}
									onClick={() => setIsAddParticipantOpen(true)}
								>
									<div className={styles.actionIcon}>👤</div>
									<span className={styles.actionLabel}>Add Participant</span>
								</button>
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
								<Button
									size="small"
									variant="ghost"
									onClick={() => setIsViewReceiptsOpen(true)}
								>
									View All
								</Button>
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
				participants={participants}
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
				toAddress="GDZX...3K7M"
			/>
		</div>
	)
}

export default Dashboard
