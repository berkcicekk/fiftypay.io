import React from "react"
import styles from "./Card.module.css"

interface CardProps {
	children: React.ReactNode
	className?: string
	variant?: "default" | "highlight" | "accent"
	size?: "small" | "medium" | "large"
}

export const Card: React.FC<CardProps> = ({
	children,
	className = "",
	variant = "default",
	size = "medium",
}) => {
	return (
		<div
			className={`${styles.card} ${styles[variant]} ${styles[size]} ${className}`}
		>
			{children}
		</div>
	)
}

interface CardHeaderProps {
	title: string
	subtitle?: string
	action?: React.ReactNode
}

export const CardHeader: React.FC<CardHeaderProps> = ({
	title,
	subtitle,
	action,
}) => {
	return (
		<div className={styles.header}>
			<div className={styles.headerText}>
				<h3 className={styles.title}>{title}</h3>
				{subtitle && <p className={styles.subtitle}>{subtitle}</p>}
			</div>
			{action && <div className={styles.headerAction}>{action}</div>}
		</div>
	)
}

export const CardContent: React.FC<{
	children: React.ReactNode
	className?: string
}> = ({ children, className = "" }) => {
	return <div className={`${styles.content} ${className}`}>{children}</div>
}
