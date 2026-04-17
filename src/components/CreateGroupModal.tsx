import React, { useState } from "react"
import styles from "./CreateGroupModal.module.css"

interface Participant {
	id: string
	name: string
	stellarAddress?: string
}

interface CreateGroupModalProps {
	isOpen: boolean
	onClose: () => void
	onCreateGroup: (name: string, participants: Participant[]) => void
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
	isOpen,
	onClose,
	onCreateGroup,
}) => {
	const [groupName, setGroupName] = useState("")
	const [participants, setParticipants] = useState<Participant[]>([])
	const [newParticipantName, setNewParticipantName] = useState("")
	const [newParticipantAddress, setNewParticipantAddress] = useState("")

	if (!isOpen) return null

	const handleAddParticipant = () => {
		if (!newParticipantName.trim()) return

		const newParticipant: Participant = {
			id: Date.now().toString(),
			name: newParticipantName.trim(),
			stellarAddress: newParticipantAddress.trim() || undefined,
		}

		setParticipants([...participants, newParticipant])
		setNewParticipantName("")
		setNewParticipantAddress("")
	}

	const handleRemoveParticipant = (id: string) => {
		setParticipants(participants.filter((p) => p.id !== id))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!groupName.trim() || participants.length < 2) return

		onCreateGroup(groupName.trim(), participants)

		// Reset form
		setGroupName("")
		setParticipants([])
		setNewParticipantName("")
		setNewParticipantAddress("")
	}

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<div className={styles.header}>
					<h2>Create New Group</h2>
					<button className={styles.closeButton} onClick={onClose}>
						×
					</button>
				</div>

				<form onSubmit={handleSubmit}>
					<div className={styles.section}>
						<label className={styles.label}>Group Name</label>
						<input
							type="text"
							className={styles.input}
							placeholder="e.g., Antalya Trip"
							value={groupName}
							onChange={(e) => setGroupName(e.target.value)}
							required
						/>
					</div>

					<div className={styles.section}>
						<label className={styles.label}>Participants (min. 2)</label>

						<div className={styles.addParticipant}>
							<input
								type="text"
								className={styles.input}
								placeholder="Name"
								value={newParticipantName}
								onChange={(e) => setNewParticipantName(e.target.value)}
							/>
							<input
								type="text"
								className={styles.input}
								placeholder="Stellar Address (optional)"
								value={newParticipantAddress}
								onChange={(e) => setNewParticipantAddress(e.target.value)}
							/>
							<button
								type="button"
								className={styles.addButton}
								onClick={handleAddParticipant}
								disabled={!newParticipantName.trim()}
							>
								+ Add
							</button>
						</div>

						{participants.length > 0 && (
							<div className={styles.participantList}>
								{participants.map((participant) => (
									<div key={participant.id} className={styles.participantItem}>
										<div className={styles.participantInfo}>
											<span className={styles.participantName}>
												{participant.name}
											</span>
											{participant.stellarAddress && (
												<span className={styles.participantAddress}>
													{participant.stellarAddress.slice(0, 8)}...
													{participant.stellarAddress.slice(-8)}
												</span>
											)}
										</div>
										<button
											type="button"
											className={styles.removeButton}
											onClick={() => handleRemoveParticipant(participant.id)}
										>
											×
										</button>
									</div>
								))}
							</div>
						)}
					</div>

					<div className={styles.footer}>
						<button
							type="button"
							className={styles.cancelButton}
							onClick={onClose}
						>
							Cancel
						</button>
						<button
							type="submit"
							className={styles.submitButton}
							disabled={!groupName.trim() || participants.length < 2}
						>
							Create Group
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default CreateGroupModal
