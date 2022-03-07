import { Services } from "src/services";

export function linkTo(url: string): string {
	return Services.getConfigService().uiNavPrefixPath() + url;
}