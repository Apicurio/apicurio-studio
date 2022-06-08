import { ValidationProblem } from "@apicurio/data-models";
import { ISpectralDiagnostic } from "@stoplight/spectral-core";

export interface ISpectralService {
  ValidateDocument(
    document: string,
    ruleset: string
  ): Promise<ISpectralDiagnostic[]>;
}