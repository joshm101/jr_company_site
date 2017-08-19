import { Component, Input } from '@angular/core';

@Component({
    selector: 'public-nav-bar-menu-icon',
    templateUrl:'public-nav-bar-menu-icon.component.html'
})
export class PublicNavBarMenuIconComponent {
    @Input() public isOpen: boolean = false;    
    constructor() {
        this.isOpen = false;
    }
}