import { bundleAndLoadRuleset } from "@stoplight/spectral-ruleset-bundler/with-loader";
import { ISpectralService as ISpectralService } from "./ISpectralService";
import { fetch as spectralFetch } from "@stoplight/spectral-runtime";
import { ISpectralDiagnostic, Ruleset, Spectral } from "@stoplight/spectral-core";
import fetch from 'node-fetch';
import yaml from 'js-yaml';
import HttpStatusCode from "../models/HttpStatusCodes";
import { RulesetNotFoundError } from "../errors/index";

/**
 * Spectral Service
 */
export class SpectralService implements ISpectralService {
  async ValidateDocument(document: string, ruleset: string): Promise<ISpectralDiagnostic[]> {
    const resolvedRuleset = await loadRuleset(ruleset);

    const spectral = new Spectral();
    spectral.setRuleset(resolvedRuleset);

    return spectral.run(document);
  }
}

// mock a file system implementation
const createMemoryFs = (myRuleset: string): any => ({
  promises: {
    async readFile(_?: string) {
      return myRuleset;
    },
  },
});

async function loadRuleset(rulesetRef: string): Promise<Ruleset> {
  const rulesetData = await resolveRulesetContent(rulesetRef);
  const memFs = createMemoryFs(rulesetData);

  return bundleAndLoadRuleset("/.spectral.json", {
    fs: memFs,
    fetch: spectralFetch,
  });
}

function isHttpUrl(str: string) {
  let url: URL;

  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

async function resolveRulesetContent(rulesetRef: string): Promise<string> {
  if (!isHttpUrl(rulesetRef)) {
    return rulesetRef;
  }

  const response = await fetch(rulesetRef);

  if (response.status === HttpStatusCode.NOT_FOUND) {
    throw new RulesetNotFoundError(`No ruleset found at location: ${rulesetRef}`);
  } else if (response.ok) {
    let data = await response.text();

    // Get document, or throw exception on error
    try {
      const doc = yaml.load(data);
      data = JSON.stringify(doc);
    } catch (e) {
      // do nothing, assume it to be JSON
    }

    return data;
  } else {
    throw new Error("Error retrieving ruleset: " + response.statusText);
  }
}