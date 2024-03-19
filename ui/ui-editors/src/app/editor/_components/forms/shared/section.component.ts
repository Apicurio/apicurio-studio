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

import {Node} from "@apicurio/data-models";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    Input,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {AbstractBaseComponent} from "../../common/base-component";
import {DocumentService} from "../../../_services/document.service";
import {CommandService} from "../../../_services/command.service";
import {SelectionService} from "../../../_services/selection.service";
import {TopicSubscription} from "apicurio-ts-core";
import {KeypressUtils} from "../../../_util/keypress.util";


@Component({
    selector: "section",
    templateUrl: "section.component.html",
    styleUrls: ["section.component.css"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionComponent extends AbstractBaseComponent {

    public static allVisibleSections: SectionComponent[] = [];

    @Input() type: string;
    @Input() label: string;
    @Input() expanded: boolean = true;
    @Input() counterItems: any[];
    @Input() contextHelp: string;

    @Input() validationModels: Node[];
    @Input() validationShallow: boolean;
    @Input() validationProperties: string[];

    @Input() collaborationNodePath: string | string[];

    @Input() inForm: boolean = true;

    @ViewChild("sectionHeader", { static: true }) sectionHeader: ElementRef;
    @ViewChild("sectionBody", { static: true }) sectionBody: ElementRef;

    showContextMenu: boolean = false;
    contextMenuPos: any = {
        top: "0px",
        left: "0px"
    }

    private _highlightSubscription: TopicSubscription<string>;
    public showHighlight: boolean = false;

    /**
     * C'tor.
     * @param changeDetectorRef
     * @param documentService
     * @param commandService
     * @param selectionService
     */
    constructor(changeDetectorRef: ChangeDetectorRef, documentService: DocumentService,
                private commandService: CommandService, selectionService: SelectionService) {
        super(changeDetectorRef, documentService, selectionService);
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.inForm) {
            SectionComponent.allVisibleSections.push(this);
        }

        if (this.inForm) {
            let component: SectionComponent = this;
            this._highlightSubscription = this.__selectionService.highlight().subscribe(path => {
                setTimeout(() => {
                    if (component.acceptsPath(path)) {
                        component.highlight();
                    }
                }, 50);
            });
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        let idx: number = SectionComponent.allVisibleSections.indexOf(this);
        if (idx !== -1) {
            SectionComponent.allVisibleSections.splice(idx, 1);
        }
        if (this._highlightSubscription) {
            this._highlightSubscription.unsubscribe();
        }
    }

    /**
     * Returns true if the given path is "contained within" this section.
     * @param path
     */
    protected acceptsPath(path: string): boolean {
        if (!this.collaborationNodePath || !path) {
            return false;
        }

        let sectionPaths: string[] = [];
        if (Array.isArray(this.collaborationNodePath)) {
            sectionPaths = <string[]>this.collaborationNodePath;
        } else {
            sectionPaths.push(this.collaborationNodePath);
        }

        for (let sectionPath of sectionPaths) {
            if (path.indexOf(sectionPath) === 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Briefly? highlight this section (visually).
     */
    public highlight(): void {
        console.info("[SectionComponent] Highlighting section: ", this.type);
        this.expand();
        this.showHighlight = true;
        let me: SectionComponent = this;
        setTimeout( () => {
            me.sectionBody.nativeElement.scrollIntoView({
                block: "center", inline: "nearest", behavior: "smooth"
            });
        }, 50);
        setTimeout(() => {
            me.showHighlight = false;
            this.__changeDetectorRef.markForCheck();
        }, 5000);
        this.__changeDetectorRef.markForCheck();
    }

    public hasCounter(): boolean {
        return this.counterItems !== null && this.counterItems !== undefined;
    }

    public hasValidationAggregate(): boolean {
        return this.validationModels !== null && this.validationModels !== undefined;
    }

    public toggleExpansion(): void {
        this.expanded = !this.expanded;
    }

    public openContextMenu(event: MouseEvent): void {
        if (!this.inForm) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();

        let box = this.sectionHeader.nativeElement.getBoundingClientRect();

        let body = document.body;
        let docEl = document.documentElement;

        let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        let clientTop = docEl.clientTop || body.clientTop || 0;
        let clientLeft = docEl.clientLeft || body.clientLeft || 0;

        let top  = box.top +  scrollTop - clientTop;
        let left = box.left + scrollLeft - clientLeft;

        this.contextMenuPos.left = Math.round(left) + "px";
        this.contextMenuPos.top = (Math.round(top) + box.height - 5) + "px";
        this.showContextMenu = true;
    }

    public closeContextMenu(): void {
        this.showContextMenu = false;
    }

    public collapseAllOtherSections(): void {
        this.expanded = true;
        let me: SectionComponent = this;
        SectionComponent.allVisibleSections.forEach( section => {
            if (section !== me) {
                section.collapse();
            }
        });
    }

    public collapse(): void {
        this.expanded = false;
        // The collapse() method is called from outside the normal chain of command, so we need
        // to mark it as needing change detection (since we just changed its state).  This is because
        // we're using OnPush as the change detection strategy across all editor components.
        this.__changeDetectorRef.markForCheck();
    }

    public expand(): void {
        this.expanded = true;
        // The expand() method is called from outside the normal chain of command, so we need
        // to mark it as needing change detection (since we just changed its state).  This is because
        // we're using OnPush as the change detection strategy across all editor components.
        this.__changeDetectorRef.markForCheck();
    }

    public collapseAllSections(): void {
        SectionComponent.allVisibleSections.forEach( section => {
            section.collapse();
        });
    }

    public expandAllSections(): void {
        SectionComponent.allVisibleSections.forEach( section => {
            section.expand();
        });
    }

    /**
     * Called whenever the user presses a key.
     * @param event
     */
    public onGlobalKeyDown(event: KeyboardEvent): void {
        if (KeypressUtils.isEscapeKey(event)) {
            this.closeContextMenu();
        }
    }

    @HostListener("document:click", ["$event"])
    public onDocumentClick(event: MouseEvent): void {
        this.closeContextMenu();
    }

}
