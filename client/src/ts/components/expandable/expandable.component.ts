import { Component, Input, Output, EventEmitter,
         trigger, state, style, animate, transition, keyframes } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

@Component({
  selector: 'expandable',
  templateUrl: 'expandable.component.html',
  animations: [
    trigger('expandState', [
      state('expanded', style({
        transform: 'translateY(0)',
        opacity: 1,

      })),
      state('collapsed', style({
        transform: 'translateY(-100%)',
        opacity: 0,

      })),
      transition('expanded => collapsed', 
        [
          animate('400ms ease', keyframes([
            style({
              transform: 'translateY(0)', 
              opacity: '1', 
              offset: 0
            }),
            style({
              transform: 'translateY(-50%)',
              opacity: '0', 
              offset: 0.5
            }),
            style({
              transform: 'translateY(-80%)',
              opacity: '0', 
              offset: 0.8
            }),
            style({
              transform: 'translateY(-100%)',
              opacity: '0', 
              offset: 1
            })
          ]))
        ]
      ),
      transition('collapsed => expanded', 
        [
          animate('400ms ease', keyframes([
            style({
              transform: 'translateY(-100%)',
              opacity: '0', 
              offset: 0
            }),
            style({
              transform: 'translateY(-50%)',
              opacity: '0', 
              offset: 0.5
            }),
            style({
              transform: 'translateY(-20%)',
              opacity: '0', 
              offset: 0.8
            }),
            style({
              transform: 'translateY(0)', 
              opacity: '1', 
              offset: 1
            })
          ]))
        ]
      )
    ])
  ]
})
export class ExpandableComponent {

  // Use _expandValueEmitter to hold our current
  // animation state. expand$ will be the observable
  // obtained by calling _expandValueEmitter.asObservable().

  // holds the value of current animation state as either
  // 'expanded' or 'collapsed'. 
  private _expandStateEmitter: BehaviorSubject<string>;

  // This is the result of calling this._expandStateEmitter.asObservable().
  // This Observable is subscribed to in this component's template
  // to determine whether or not to expand content - [@expandState]="expand$ | async".
  public expand$: Observable<string>;

  /**
   * Setter to set next value of the BehaviorSubject this._expandStateEmitter.
   * Since this.expand$ is the result of this._expandStateEmitter.asObservable(),
   * this.expand$ will emit a new value (either 'expanded' or 'collapsed'). 
   * this.expand$ is being subscribed to in the view to trigger collapse/expand,
   * so this setter ultimately triggers expand/collapse animation 
   */
  @Input() public set shouldExpand(val: boolean) {
    if (val) {
      // shouldExpand val setter is true,
      // so we are expanding content
      this._expandStateEmitter.next('expanded');

      // Notify outside component that
      // the wrapped content has started 
      // expanding
      this.expanding.emit(true);
    } else {
      // shouldExpand val setter is false,
      // so we are collapsing content
      this._expandStateEmitter.next('collapsed');

      // Notify outside component that
      // the wrapped content has started
      // collapsing
      this.collapsing.emit(true);
    }
    // some animation is occurring going
    // from either collapsed to expanded or
    // expanded to collapsed
    this.animating.emit(true);
  }

  /**
   * Lifecycle event hooks
   */
  // emitted when component begins to collapse (i.e., 'isCollapsing')
  @Output() public collapsing: EventEmitter<boolean>; 
  
  // emitted when component begins to expand (i.e., 'isExpanding')
  @Output() public expanding: EventEmitter<boolean>;

  // emitted when component begins any animation (collapsing or expanding)
  @Output() public animating: EventEmitter<boolean>;

  // emitted when the component is done collapsing
  @Output() public doneCollapse: EventEmitter<boolean>;

  // emitted when the component is done expanding
  @Output() public doneExpand: EventEmitter<boolean>;

 // emitted when the component is done with any animation (collapsing or expanding)
  @Output() public doneAnimate: EventEmitter<boolean>;

  constructor(
    
  ) {
    // initialize event emitters
    this.collapsing = new EventEmitter<boolean>();
    this.expanding = new EventEmitter<boolean>();
    this.animating = new EventEmitter<boolean>();
    this.doneCollapse = new EventEmitter<boolean>();
    this.doneExpand = new EventEmitter<boolean>();
    this.doneAnimate = new EventEmitter<boolean>();

    this._expandStateEmitter = new BehaviorSubject<string>('expanded');
    this.expand$ = this._expandStateEmitter.asObservable();
  }

  /**
   * Handler function for animation finshed which
   * either emits doneExpand or doneCollapse
   * depnding on type of animation that just finished
   */
  public handleDoneAnimate() {

    // subscribe to latest observed
    // expand value to determine what
    // occurred (collapse or expand)
    this.expand$.take(1).subscribe(
      (expand) => {
        if (expand === 'expanded') {
          // Content done expanding,
          // emit doneExpand
          this.doneExpand.emit(true);
        } else {
          // Content done collapsing,
          // emit doneCollapse
          this.doneCollapse.emit(true);
        }
        // some sort of animation finished,
        // emit doneAnimate
        this.doneAnimate.emit(true);
      }
    )
  }
}