import { ISpectralDiagnostic } from "@stoplight/spectral-core";

export interface SpectralDiagnosticList {
	items: ISpectralDiagnostic[];
}

export interface DocumentValidationRequest {
	ruleset: string;
	document: string;
}

export interface Document {
	content: string;
}

type Error = {
	type: ErrorCode;
	title: string;
	detail: string;
};

export type ApiResponse<T = undefined> = Error | T;

export enum ErrorCode {
	RULESET_NOT_FOUND = "RULESET_NOT_FOUND",
	INVALID_REQUEST_BODY = "INVALID_REQUEST_BODY",
	INVALID_RULESET = "INVALID_RULESET",
	SPECTRAL_ERROR = "SPECTRAL_ERROR",
	SERVER_ERROR = "SERVER_ERROR"
}

export type ErrorCodeTitle = {
	[key in ErrorCode]: string
}

export const ErrorTitle: ErrorCodeTitle = {
	RULESET_NOT_FOUND: 'Ruleset not found',
	INVALID_RULESET: "Invalid ruleset",
	SERVER_ERROR: "Internal server error",
	INVALID_REQUEST_BODY: "Invalid request body",
	SPECTRAL_ERROR: "Spectral error"
}