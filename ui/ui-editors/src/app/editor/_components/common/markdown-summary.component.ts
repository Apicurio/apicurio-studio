/**
 * @license
 * Copyright 2018 JBoss Inc
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

import {Component, Input, OnChanges, SimpleChanges, ViewEncapsulation} from "@angular/core";
import * as marked from "marked";

@Component({
    selector: "markdown-summary",
    template: `<span class="md-summary" [innerHTML]="convertedData" [class.empty]="isEmpty()"></span>`,
    encapsulation: ViewEncapsulation.None
})
export class MarkdownSummaryComponent implements OnChanges {
    @Input("data")
    data: string;
    @Input("delimiter")
    delimiter: string = " ";
    @Input("showImageText")
    showImageText: boolean = false;
    @Input("emptyText")
    emptyText: string = "No value.";

    convertedData: string;

    ngOnChanges(changes: SimpleChanges): void {
        if (this.isEmpty()) {
            this.convertedData = this.emptyText;
        } else {
            let ptRenderer: marked.Renderer = new PlainTextRenderer();
            this.convertedData = marked.parse(this.data, {
                renderer: ptRenderer
            }).trim();
        }
    }

    public isEmpty(): boolean {
        return this.data === null || this.data === undefined || this.data.trim().length === 0;
    }

}


class PlainTextRenderer extends marked.Renderer {

    delimiter: string = " ";
    showImageText: boolean = false;

    public code(code, lang, escaped): string {
        return this.delimiter + "<code>...</code>" + this.delimiter;
    }
    public blockquote(quote): string {
        return '\t' + quote + this.delimiter;
    }
    public html(html): string {
        return escape(html);
    }
    public heading(text, level, raw): string {
        return text;
    }
    public hr(): string {
        return this.delimiter + this.delimiter;
    }
    public list(body, ordered): string {
        return body;
    }
    public listitem(text): string {
        return '\t' + text + this.delimiter;
    }
    public paragraph(text): string {
        return this.delimiter + text + this.delimiter;
    }
    public table(header, body): string {
        return  this.delimiter + header + this.delimiter + body + this.delimiter;
    }
    public tablerow(content): string {
        return content + this.delimiter;
    }
    public tablecell(content, flags): string {
        return content + '\t';
    }
    public strong(text): string {
        return text;
    }
    public em(text): string {
        return text;
    }
    public codespan(text): string {
        return text;
    }
    public br(): string {
        return this.delimiter + this.delimiter;
    }
    public del(text): string {
        return text;
    }
    public link(href, title, text): string {
        return text;
    }
    public image(href, title, text): string {
        return this.showImageText ? text : '';
    }
    public text(text): string {
        return text;
    }
}
