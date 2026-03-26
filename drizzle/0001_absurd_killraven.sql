CREATE TABLE `assets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('market_research','course','email_campaign') NOT NULL,
	`title` varchar(512) NOT NULL,
	`content` text NOT NULL,
	`metadata` json,
	`tags` varchar(512),
	`isFavorite` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`paddleSubscriptionId` varchar(128),
	`paddleCustomerId` varchar(128),
	`plan` enum('starter','pro','agency') NOT NULL DEFAULT 'starter',
	`status` enum('active','trialing','past_due','canceled','paused') NOT NULL DEFAULT 'trialing',
	`currentPeriodStart` timestamp,
	`currentPeriodEnd` timestamp,
	`cancelAtPeriodEnd` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `usage_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`feature` enum('market_research','course_architect','cold_emailer') NOT NULL,
	`tokensUsed` bigint NOT NULL DEFAULT 0,
	`model` varchar(128),
	`durationMs` int,
	`success` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `usage_logs_id` PRIMARY KEY(`id`)
);
