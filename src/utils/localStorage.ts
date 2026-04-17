const STORAGE_KEYS = {
	GROUPS: "fiftypay_groups",
	EXPENSES: "fiftypay_expenses",
	RECEIPTS: "fiftypay_receipts",
	PARTICIPANTS: "fiftypay_participants",
}

export interface StoredGroup {
	id: string
	name: string
	description?: string
	date?: string
	createdAt: string
	participantIds: string[]
}

export interface StoredExpense {
	id: string
	groupId: string
	description: string
	amount: number
	paidBy: string
	splitBetween: string[]
	date: string
	settled: boolean
	receiptId?: string
}

export interface StoredReceipt {
	id: string
	fileName: string
	fileType: string
	fileSize: number
	uploadedAt: string
	previewUrl?: string
}

export interface StoredParticipant {
	id: string
	name: string
	stellarAddress?: string
}

// Groups
export const getGroups = (): StoredGroup[] => {
	const data = localStorage.getItem(STORAGE_KEYS.GROUPS)
	return data ? JSON.parse(data) : []
}

export const saveGroup = (group: StoredGroup): void => {
	const groups = getGroups()
	groups.push(group)
	localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups))
}

export const updateGroup = (
	id: string,
	updates: Partial<StoredGroup>,
): void => {
	const groups = getGroups()
	const index = groups.findIndex((g) => g.id === id)
	if (index !== -1) {
		groups[index] = { ...groups[index], ...updates }
		localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups))
	}
}

// Expenses
export const getExpenses = (groupId?: string): StoredExpense[] => {
	const data = localStorage.getItem(STORAGE_KEYS.EXPENSES)
	const expenses = data ? JSON.parse(data) : []
	return groupId
		? expenses.filter((e: StoredExpense) => e.groupId === groupId)
		: expenses
}

export const saveExpense = (expense: StoredExpense): void => {
	const expenses = getExpenses()
	expenses.push(expense)
	localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses))
}

export const updateExpense = (
	id: string,
	updates: Partial<StoredExpense>,
): void => {
	const expenses = getExpenses()
	const index = expenses.findIndex((e) => e.id === id)
	if (index !== -1) {
		expenses[index] = { ...expenses[index], ...updates }
		localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses))
	}
}

// Receipts
export const getReceipts = (): StoredReceipt[] => {
	const data = localStorage.getItem(STORAGE_KEYS.RECEIPTS)
	return data ? JSON.parse(data) : []
}

export const saveReceipt = (receipt: StoredReceipt): void => {
	const receipts = getReceipts()
	receipts.push(receipt)
	localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(receipts))
}

// Participants
export const getParticipants = (): StoredParticipant[] => {
	const data = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS)
	return data ? JSON.parse(data) : []
}

export const saveParticipant = (participant: StoredParticipant): void => {
	const participants = getParticipants()
	participants.push(participant)
	localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants))
}
