import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'nav-header',
    templateUrl: 'nav-header.component.html',
    styleUrls: [ 'nav-header.component.css' ]
})
export class NavHeaderComponent implements OnInit {

    constructor(private router: Router) { }

    ngOnInit(): void {
    }

}
