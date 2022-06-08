import { FastifyInstance } from "fastify";
import { ISpectralService } from "../services/ISpectralService";
import { DocumentValidationRequest, ErrorCode, ErrorTitle } from "../models";
import { NodePath, ValidationProblem, ValidationProblemSeverity } from "@apicurio/data-models";
import { ISpectralDiagnostic } from "@stoplight/spectral-core";
import { DiagnosticSeverity } from "@stoplight/types";
import { RulesetNotFoundError } from "../errors/index";
import HttpStatusCode from "../models/HttpStatusCodes";

export const configureRoutes = (
  fastify: FastifyInstance,
  spectralService: ISpectralService
) => {

  fastify
    .post<{ Body: DocumentValidationRequest }>("/validate", async (req, reply) => {
      if (req.body?.document == null || req.body?.ruleset == null) {
        const responseBody = {
          code: ErrorCode.INVALID_REQUEST_BODY,
          title: ErrorTitle.INVALID_REQUEST_BODY,
          statusCode: HttpStatusCode.BAD_REQUEST,
          detail: ''
        };

        // TODO: Bing an OpenAPI schema to the API to provide automatic request validation
        if (req.body == null) {
          responseBody.detail = 'Request body is missing.'
          reply.code(HttpStatusCode.BAD_REQUEST).send(responseBody);
        }

        const missingFields = [];
        if (req.body.document == null) {
          missingFields.push('document');
        }
        if (req.body.ruleset == null) {
          missingFields.push('ruleset');
        }

        reply.code(HttpStatusCode.BAD_REQUEST).send(responseBody);
      }
      const { document, ruleset } = req.body;

      let results: ISpectralDiagnostic[];
      try {
        results = await spectralService.ValidateDocument(document, ruleset);
      } catch (err) {
        fastify.log.error(err);
        if (err instanceof RulesetNotFoundError) {
          reply.code(HttpStatusCode.NOT_FOUND).send({
            code: ErrorCode.RULESET_NOT_FOUND,
            detail: err.message,
            title: ErrorTitle.RULESET_NOT_FOUND,
            statusCode: HttpStatusCode.NOT_FOUND
          })
        } else {
          reply.code(HttpStatusCode.BAD_REQUEST).send({
            code: ErrorCode.SPECTRAL_ERROR,
            title: ErrorTitle.SPECTRAL_ERROR,
            statusCode: HttpStatusCode.BAD_REQUEST,
            detail: err.message
          })
          return;
        }
      }

      const problems: ValidationProblem[] = results.map((d: ISpectralDiagnostic) => {
        return {
          errorCode: d.code.toString(),
          nodePath: new NodePath("/" + d.path.join("/")),
          message: d.message,
          severity: severityCodeMapConfig[d.severity],
          property: d.path[d.path.length - 1].toString(),
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          accept: () => { },
        }
      });

      reply.send({ items: problems });
    });
};

// map severity codes from Spectral to Apicurio severity codes
const severityCodeMapConfig: { [key in DiagnosticSeverity]: ValidationProblemSeverity } = {
  0: ValidationProblemSeverity.high,
  1: ValidationProblemSeverity.medium,
  2: ValidationProblemSeverity.low,
  3: ValidationProblemSeverity.ignore,
};