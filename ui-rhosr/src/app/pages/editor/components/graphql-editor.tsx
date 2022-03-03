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
import React from 'react';
import { GraphQLEditor, LightTheme } from 'graphql-editor';
import { PassedSchema } from 'graphql-editor/lib/Models';
import { PureComponent, PureComponentProps, PureComponentState } from 'src/app';
import { Services } from 'src/services';


export interface GraphQLSchemaEditorProps extends PureComponentProps {
  content: string
  onChange: (newContent: string) => void;
}

export interface GraphQLSchemaEditorState extends PureComponentState {
  schema: PassedSchema
}

export class GraphQLSchemaEditor extends PureComponent<GraphQLSchemaEditorProps, GraphQLSchemaEditorState> {
  protected initializeState(): GraphQLSchemaEditorState {
    return {
      schema: {code: this.props.content}
    };
  }

  constructor(props: Readonly<GraphQLSchemaEditorProps>) {
      super(props);
  }

  setSchema(props: PassedSchema) {
    if (props.code != this.props.content) {
      this.setState({schema: {code: props.code}});
      this.props.onChange(props.code);
    }
  }

  public componentDidMount() {
      Services.getLoggerService().debug("[GraphQLSchemaEditor] Component did MOUNT.");
  }

  public componentDidUpdate(prevProps: Readonly<GraphQLSchemaEditorProps>, _prevState: Readonly<GraphQLSchemaEditorState>, _snapshot?: {}) {
      Services.getLoggerService().debug("[GraphQLSchemaEditor] Component did UPDATE -- previous props: ", prevProps);
  }

  public render(): React.ReactElement {
    return (
        <div
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          alignSelf: 'stretch',
          display: 'flex',
          position: 'relative',
        }}>
          <GraphQLEditor
            theme={LightTheme}
            setSchema={(props) => this.setSchema(props)}
            schema={this.state.schema}/>
      </div>
    );
  }
};