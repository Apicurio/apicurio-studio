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
import React from "react";
import { BasicEditor, GraphQLSchemaEditor, OpenApiEditor } from ".";

export type Maybe<T> = T | null | undefined;

export interface BaseEditorProps {
	artifactType?: Maybe<string>;
	content: Maybe<string>;
	onChange: (newContent: Maybe<string>) => void;
}

export const BaseEditor = ({ content, artifactType, onChange }: BaseEditorProps): JSX.Element => {
	switch (artifactType) {
		case 'OPENAPI':
			return  (
				<OpenApiEditor className="editor-flex-editor" content={ content as string } onChange={ onChange } />
			)
		case 'GRAPHQL':
			return (
				<GraphQLSchemaEditor content={ content as string } onChange={onChange}/>
			)
		default:
			return (
				<BasicEditor content={content} onChange={onChange} language={artifactType}/>
			)
	};
}