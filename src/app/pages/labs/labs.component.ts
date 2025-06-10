import { Component } from '@angular/core';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {signal} from '@angular/core';

@Component({
  selector: 'app-labs',
  imports: [ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})

export class LabsComponent {
  tasks = signal(["Install cli","create project","create components" ])
  name = signal("Andres");
  age=23;
  isDisabled = true;
  img = "https://www.w3schools.com/howto/img_avatar.png";

  colorCtrl = new FormControl();

  constructor(){
    this.colorCtrl.valueChanges.subscribe(value => console.log(value))
  }

  person = {
    name:"Andres",
    age:"23",
    img: this.img
  }

  clickHandler(){
    alert("Click in button")
  }

  inputHandler(event:Event){
    console.log(event)
  }

  keydownHandler(event:KeyboardEvent){
    const input = event.target as HTMLInputElement
    const value =  input.value
    console.log(value)
  }

  signalHandler(event: Event){
    const input = event.target as HTMLInputElement;
    this.name.set(input.value);

  }

}
