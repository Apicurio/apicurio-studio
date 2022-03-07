/**
 * @license
 * Copyright 2022 Red Hat
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React, { PureComponent, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { PureComponentState } from "src/app";
import { Services } from "src/services";
import { usePrevious } from '../../../hooks';
import { BaseEditorProps, Maybe } from "./base-editor";

export interface BasicEditorProps extends BaseEditorProps {
	language: Maybe<string>
}

export const BasicEditor = (props: BasicEditorProps): JSX.Element => {
	const mounted = useRef<boolean>();
	const prevProps = usePrevious<BasicEditorProps>(props);
	
	useEffect(() => {
		if (!mounted.current) {
			// do componentDidMount logic
			Services.getLoggerService().debug("[BasicEditor] Component did MOUNT.");
			mounted.current = true;
		} else {
			// do componentDidUpdate logic
			Services.getLoggerService().info("[BasicEditor] Component did UPDATE -- previous props: ", prevProps);
		}
	});

	return (
		<Editor
			height="100vh"
			defaultLanguage={getArtifactLanguage(props.language)}
			defaultValue={ props.content as string }
			onChange={(value) => props.onChange(value)}
		/>
	);
}

// maps the artifact type to the associated language type from the editor
const getArtifactLanguage = (artifactType: Maybe<string>): string => {
	if (artifactType == undefined) {
		return textLanguage;
	}
	const language = artifactTypeMonacoLanguageMap[artifactType];

	return language || textLanguage;
}

const jsonLanguage = 'json';
const xmlLanguage = 'xml';
const textLanguage = 'text';

const artifactTypeMonacoLanguageMap: {[key: string]: string} = {
	'XML': xmlLanguage,
	'GRAPHQL': 'graphql',
	'AVRO': jsonLanguage,
	'ASYNCAPI': jsonLanguage,
	'WSDL': xmlLanguage,
	'XSD': xmlLanguage,
	'PROTOBUF': textLanguage,
	'KCONNECT': textLanguage
}