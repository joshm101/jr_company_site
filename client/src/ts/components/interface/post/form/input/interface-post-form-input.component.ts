import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputModeEnum } from '../../../../../enums/input-mode.enum';

const noop = () => {
};

export const ADD_POST_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InterfacePostFormInputComponent),
  multi: true
};

@Component({
  selector: 'int-post-form-input',
  templateUrl: 'interface-post-form-input.component.html',
  providers: [
      ADD_POST_INPUT_CONTROL_VALUE_ACCESSOR
  ]
})
export class InterfacePostFormInputComponent implements ControlValueAccessor, OnInit {
  constructor(

  ) {

  }

  ngOnInit() {
    if(this.fillerInputDisplay === undefined) {
      if (this._innerValue === "") this.fillerInputDisplay = true;
    }
  }

  // internal data model
  private _innerValue: any = '';

  // Boilerplate placeholders for the callbacks later provided by
  // the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  // get accessor
  get value(): any {
    return this._innerValue;
  }

  // set accessor including
  // onChangeCallback
  set value(val: any) {
    if (val !== this._innerValue) {
      this._innerValue = val;
      this.onChangeCallback(val);
    }
  }

  // set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  // Form ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this._innerValue) {
      if (value !== undefined || value !== '') {
        this.fillerInputDisplay = false;
      }
      this._innerValue = value;
    }
  }

  //Form ControlValueAccessor interface
  registerOnChange(fn: any) {
      if (this._innerValue == '') {
        this.fillerInputDisplay = true;
      }
      this.onChangeCallback = fn;
  }

  // Form ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  removeInputFiller(event: Event) {
    this.fillerInputDisplay  = false;
    if (event.srcElement.innerHTML === "") {
      this.fillerInputDisplay = true;
      event.srcElement.innerHTML = "<br>";
    }
  }

  @Input() fillerText: string;
  @Input() inputMode: InputModeEnum;
  @Input() biggerInput: boolean;
  @Input() fillerInputDisplay: boolean;

  InputMode = InputModeEnum;

}
