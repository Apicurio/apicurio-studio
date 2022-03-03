import { useHistory } from "react-router";
import { Services } from "src/services";

export function useNavigation(): (location: string) => void {
	const history = useHistory();

	return (location) => {
		if (history) {
			Services.getLoggerService().info("Navigating to:", location);
			history.push(location);
		} else {
			Services.getLoggerService().warn("Navigation impossible, null/undefined history.");
		}
	}
}