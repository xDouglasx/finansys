import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from "@angular/forms"

@Component({
  selector: 'app-form-field-error',
  template: `
    <p class="text-danger">
      {{errorMessage}}
    </p>
  `,
  styleUrls: ['./form-field-error.component.css']
})
export class FormFieldErrorComponent implements OnInit {

  @Input('form-control') formControl: FormControl;

  constructor() { }

  ngOnInit() {
  }

  public get errorMessage(): string | null {
    return this.mustShowErrorMessage() ? this.getErrorMessage() : null;
  }

  private mustShowErrorMessage(): boolean {
    return this.formControl.invalid && this.formControl.touched
  }

  private getErrorMessage(): string {
    if(this.formControl.errors.required) {
      return "dado obrigatorio."
    }
    else if(this.formControl.errors.email) {
      return "email invalido."
    }
    else if(this.formControl.errors.minlength){
      const requiredLength = this.formControl.errors.minlength.requiredLength;
      return `deve ter no minimo ${requiredLength} caracteres.`
    }
    else if(this.formControl.errors.maxlength){
      const requiredLength = this.formControl.errors.minlength.requiredLength;
      return `deve ter no maximo ${requiredLength} caracteres.`
    }
  }
}
