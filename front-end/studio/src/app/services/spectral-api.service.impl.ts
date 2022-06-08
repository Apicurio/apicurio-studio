import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ValidationProblem } from "@apicurio/data-models";
import { ConfigService } from "./config.service";
import { DocumentValidationRequest, ISpectralValidationService, ValidationProblemList } from "./spectral-api.service";

@Injectable()
export class SpectralValidationService implements ISpectralValidationService {
	private baseUrl: string;
	constructor(private httpClient: HttpClient, config: ConfigService) {
		this.baseUrl = config.spectralApiUrl();
	}
	
	async validate(document: string, ruleset: string): Promise<ValidationProblem[]> {
		const body: DocumentValidationRequest = {
			document,
			ruleset
		};

		const validateUrl = new URL('/validate', this.baseUrl);

		// TODO: handle errors??
		const problemList = await this.httpClient
			.post<ValidationProblemList>(validateUrl.href, body)
			.toPromise();

		return problemList.items;
	}
} 