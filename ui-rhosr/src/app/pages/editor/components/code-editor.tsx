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
import React, { PureComponent } from "react";
import Editor from "@monaco-editor/react";
import { PureComponentProps, PureComponentState } from "src/app";
import { Services } from "src/services";

export interface CodeEditorProps extends PureComponentProps {
	content: string | null
  	onChange: (newContent: string ) => void
	language: string | undefined
}

export interface CodeEditorState extends PureComponentState {
	content: string
}

export class CodeEditor extends PureComponent<CodeEditorProps, CodeEditorState> {
	protected initializeState(): CodeEditorState {
	  return {
		content: this.props.content as string
	  };
	}
  
	constructor(props: Readonly<CodeEditorProps>) {
		super(props);
	}

	public componentDidMount() {
		Services.getLoggerService().debug("[CodeEditor] Component did MOUNT.");
	}
  
	public componentDidUpdate(prevProps: Readonly<CodeEditorProps>, _prevState: Readonly<CodeEditorState>, _snapshot?: {}) {
		Services.getLoggerService().debug("[CodeEditor] Component did UPDATE -- previous props: ", prevProps);
	}

	render(): React.ReactElement {
		return <Editor
			height="100vh"
			defaultLanguage={getArtifactLanguage(this.props.language)}
			defaultValue={ this.props.content as string }
			onChange={(value) => this.props.onChange(value as string)}
		/>
	}
}

// maps the artifact type to the associated language type from the editor
const getArtifactLanguage = (artifactType: string | undefined): string => {
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
	'WSDL': xmlLanguage,
	'XSD': xmlLanguage,
	'PROTOBUF': textLanguage,
	'KCONNECT': textLanguage
}