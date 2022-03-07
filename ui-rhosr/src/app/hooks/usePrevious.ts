import { useEffect, useRef } from "react";

// A hook to get the value of a property prior to render
export function usePrevious<T>(value: T): T | undefined {
	const ref = useRef<T>();
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
 }