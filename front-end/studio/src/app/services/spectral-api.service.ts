import { ValidationProblem } from "@apicurio/data-models";

export interface DocumentValidationRequest {
	ruleset: string;
	document: string;
}

export interface ValidationProblemList {
	items: ValidationProblem[];
}

export type Error = {
	type: string;
	title: string;
	detail: string;
};

export interface ISpectralValidationService {
	/**
	 * Validate a document using the supplied Spectral ruleset
	 * returns the Spectral diagnostic list mapped to a list of ValidationProblems
	 * 
	 * @param document - The source document to validate
	 * @param ruleset - Spectral Ruleset. Can be HTTP URL to a remote ruleset or the raw string contents
	 */
	validate(document: string, ruleset: string): Promise<ValidationProblem[]>;
}
