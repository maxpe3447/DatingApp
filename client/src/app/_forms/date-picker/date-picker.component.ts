import { Component, Injectable, Input, OnInit, Self } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDateParserFormatter, NgbDateStruct, NgbDatepickerConfig, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}
@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, NgbDatepickerModule, ReactiveFormsModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css',
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ]
})
export class DatePickerComponent implements ControlValueAccessor, OnInit {
  @Input() label = '';
  @Input() maxDate: Date | undefined;
  constructor(@Self() public ngControl: NgControl,
    private config: NgbDatepickerConfig) {
    this.ngControl.valueAccessor = this;
  }
  ngOnInit(): void {

    if(!this.maxDate){
      return;
    }
    this.config.maxDate = {
      day: this.maxDate.getDay()+1,
      month: this.maxDate.getMonth()+1,
      year: this.maxDate.getFullYear()
    };
  }
  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }


  model: NgbDateStruct | null = null;
  date: { year: number; month: number } | null = null;
}
