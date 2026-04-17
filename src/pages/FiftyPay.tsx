import React, { useState } from "react"
import CreateGroupModal from "../components/CreateGroupModal"
import styles from "./FiftyPay.module.css"

interface Group {
	id: string
	name: string
	participants: Participant[]
	expenses: Expense[]
	createdAt: Date
}

interface Participant {
	id: string
	name: string
	stellarAddress?: string
}

interface Expense {
	id: string
	description: string
	amount: number
	paidBy: string
	splitBetween: string[]
	settled: boolean
	date: Date
}

interface Balance {
	participantId: string
	participantName: string
	amount: number
}

interface Settlement {
	from: string
	fromName: string
	to: string
	toName: string
	amount: number
}

const FiftyPay: React.FC = () => {
	const [groups, setGroups] = useState<Group[]>([])
	const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

	const handleCreateGroup = (name: string, participants: Participant[]) => {
		const newGroup: Group = {
			id: Date.now().toString(),
			name,
			participants,
			expenses: [],
			createdAt: new Date(),
		}
		setGroups([...groups, newGroup])
		setSelectedGroup(newGroup)
		setIsCreateModalOpen(false)
	}

	const getTotalExpenses = (group: Group) => {
		return group.expenses.reduce((sum, exp) => sum + exp.amount, 0)
	}

	const getUnsettledCount = (group: Group) => {
		return group.expenses.filter((exp) => !exp.settled).length
	}

	return (
		<div className={styles.container}>
			<div className={styles.hero}>
				<div className={styles.heroContent}>
					<div className={styles.logoSection}>
						<div className={styles.logoIcon}>💰</div>
						<h1 className={styles.title}>FiftyPay</h1>
					</div>
					<p className={styles.subtitle}>
						Split the bill. Settle instantly on Stellar.
					</p>
				</div>
			</div>

			<div className={styles.content}>
				{!selectedGroup ? (
					<div className={styles.groupsGrid}>
						<div className={styles.statsBar}>
							<div className={styles.statCard}>
								<div className={styles.statIcon}>👥</div>
								<div className={styles.statInfo}>
									<div className={styles.statValue}>{groups.length}</div>
									<div className={styles.statLabel}>Active Groups</div>
								</div>
							</div>
							<div className={styles.statCard}>
								<div className={styles.statIcon}>💸</div>
								<div className={styles.statInfo}>
									<div className={styles.statValue}>
										{groups
											.reduce((sum, g) => sum + getTotalExpenses(g), 0)
											.toFixed(2)}{" "}
										XLM
									</div>
									<div className={styles.statLabel}>Total Expenses</div>
								</div>
							</div>
						</div>

						<div className={styles.sectionHeader}>
							<h2>Your Groups</h2>
							<button
								className={styles.createButton}
								onClick={() => setIsCreateModalOpen(true)}
							>
								<span className={styles.buttonIcon}>+</span>
								Create Group
							</button>
						</div>

						{groups.length === 0 ? (
							<div className={styles.emptyState}>
								<div className={styles.emptyIcon}>🎁</div>
								<h3>No groups yet</h3>
								<p>
									Create your first group to start splitting expenses with
									friends
								</p>
								<button
									className={styles.primaryButton}
									onClick={() => setIsCreateModalOpen(true)}
								>
									Create Your First Group
								</button>
							</div>
						) : (
							<div className={styles.groupsList}>
								{groups.map((group) => (
									<div
										key={group.id}
										className={styles.groupCard}
										onClick={() => setSelectedGroup(group)}
									>
										<div className={styles.groupHeader}>
											<div className={styles.groupIcon}>👥</div>
											<div className={styles.groupInfo}>
												<h3>{group.name}</h3>
												<p>{group.participants.length} participants</p>
											</div>
										</div>
										<div className={styles.groupStats}>
											<div className={styles.groupStat}>
												<span className={styles.groupStatValue}>
													{getTotalExpenses(group).toFixed(2)} XLM
												</span>
												<span className={styles.groupStatLabel}>Total</span>
											</div>
											<div className={styles.groupStat}>
												<span className={styles.groupStatValue}>
													{getUnsettledCount(group)}
												</span>
												<span className={styles.groupStatLabel}>Pending</span>
											</div>
										</div>
										<div className={styles.groupAction}>
											<span>View Details</span>
											<span className={styles.arrow}>→</span>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				) : (
					<GroupDetailView
						group={selectedGroup}
						onBack={() => setSelectedGroup(null)}
					/>
				)}
			</div>

			<CreateGroupModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onCreateGroup={handleCreateGroup}
			/>
		</div>
	)
}

const GroupDetailView: React.FC<{ group: Group; onBack: () => void }> = ({
	group,
	onBack,
}) => {
	const [activeTab, setActiveTab] = useState<"expenses" | "balances">(
		"expenses",
	)

	return (
		<div className={styles.detailView}>
			<button className={styles.backButton} onClick={onBack}>
				← Back to Groups
			</button>

			<div className={styles.groupDetailHeader}>
				<div className={styles.groupDetailInfo}>
					<h2>{group.name}</h2>
					<p>{group.participants.length} participants</p>
				</div>
			</div>

			<div className={styles.tabs}>
				<button
					className={`${styles.tab} ${activeTab === "expenses" ? styles.activeTab : ""}`}
					onClick={() => setActiveTab("expenses")}
				>
					Expenses
				</button>
				<button
					className={`${styles.tab} ${activeTab === "balances" ? styles.activeTab : ""}`}
					onClick={() => setActiveTab("balances")}
				>
					Balances & Settlements
				</button>
			</div>

			{activeTab === "expenses" ? (
				<ExpensesTab group={group} />
			) : (
				<BalancesTab group={group} />
			)}
		</div>
	)
}

const ExpensesTab: React.FC<{ group: Group }> = ({ group }) => {
	return (
		<div className={styles.tabContent}>
			<div className={styles.tabHeader}>
				<h3>Expenses</h3>
				<button className={styles.addButton}>+ Add Expense</button>
			</div>

			{group.expenses.length === 0 ? (
				<div className={styles.emptyState}>
					<div className={styles.emptyIcon}>🧾</div>
					<h3>No expenses yet</h3>
					<p>Add your first expense to start tracking</p>
				</div>
			) : (
				<div className={styles.expensesList}>
					{group.expenses.map((expense) => (
						<div key={expense.id} className={styles.expenseCard}>
							<div className={styles.expenseInfo}>
								<h4>{expense.description}</h4>
								<p>Paid by {expense.paidBy}</p>
							</div>
							<div className={styles.expenseAmount}>
								{expense.amount.toFixed(2)} XLM
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

const BalancesTab: React.FC<{ group: Group }> = ({ group }) => {
	return (
		<div className={styles.tabContent}>
			<div className={styles.balancesGrid}>
				<div className={styles.balanceSection}>
					<h3>Net Balances</h3>
					<div className={styles.emptyState}>
						<p>No balances to show</p>
					</div>
				</div>

				<div className={styles.balanceSection}>
					<h3>Suggested Settlements</h3>
					<div className={styles.emptyState}>
						<p>All settled up! 🎉</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default FiftyPay
