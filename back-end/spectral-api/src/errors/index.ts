export class RulesetNotFoundError extends Error {
	constructor(message?: string) {
		super(message);
	}
}

export class InvalidRulesetError extends Error {
	constructor(message?: string) {
		super(message);
	}
}