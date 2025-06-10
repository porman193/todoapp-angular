import { Task } from './../../model/task.model';
import { Component, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';


export enum FILTERS {
  ALL = 'all',
  COMPLETED = 'completed',
  PENDING = 'pending'
}

@Component({
  selector: 'app-home',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})




export class HomeComponent {

  Filters=FILTERS;

  newTaskCtrl = new FormControl('',{
    nonNullable:true,
    validators:[
      Validators.required,
      Validators.pattern(/^(?!.* {3,})(?! )[^\s](.*[^\s])?$/)
    ]
  });


  editInputCtlr = new FormControl('',{
    nonNullable:true,
    validators:[
      Validators.required,
      Validators.pattern(/^(?!.* {3,})(?! )[^\s](.*[^\s])?$/)
    ]
  })

  tasks = signal<Task[]>([]);

  filter = signal<FILTERS>(this.Filters.ALL)

  tasksByFilter=computed(()=>{

    const filter =this.filter();
    const tasks = this.tasks();

    if(filter === this.Filters.PENDING){
      return tasks.filter(task => !task.completed)
    }

    if(filter === this.Filters.COMPLETED){
      return tasks.filter(task => task.completed)
    }

    return tasks;
  })

  constructor(){
    effect(()=>{
      const tasks = this.tasks();
      localStorage.setItem('task',JSON.stringify(tasks));
    })
  }

  ngOnInit(){
      const tasks = localStorage.getItem('task');
      if(tasks){
        this.tasks.set(JSON.parse(tasks))
      }
  }


  private createId(){
    return Math.random()*(100-1)+1;
  }

  addTask(){
    if(this.newTaskCtrl.valid){
      const value = this.newTaskCtrl.value;
      this.addNewTask(value);
      this.newTaskCtrl.setValue("");
    }
  }

  private addNewTask(title :string){
    if(title){
      let newTask ={
        id:this.createId(),
        title:title,
        completed:false,
      };
      this.tasks.update(tasks => [...tasks,newTask]);
    }
  }

  deleteTask(index :number){
    this.tasks.update(
      tasks => tasks.filter(
        (task,position) => position !== index
      )
    );
  }

  changeState(index: number){
      this.tasks.update(
        tasks => {
          return tasks.map(
            (task,position) =>{
              if(position == index){
                return {
                  ...task,
                  completed: !task.completed,
                }
              }
              return task
            }
          )
        }
      )
  }

  changeEditState(index:number){
    if(this.tasks()[index].completed) return

    const taskToEdit = this.tasks()[index];
    this.editInputCtlr.setValue(taskToEdit.title);
    console.log(this.editInputCtlr.value)
    this.tasks.update(
      tasks => {
        return tasks.map(
          (task,position) =>{
            if(position == index){
              return {
                ...task,
                edit:true,
              }
            }
            return {
              ...task,
              edit:false
            }
          }
        )
      }
    )

  }

  editHandler(index:number){
    if(this.editInputCtlr.valid){
      const newValue = this.editInputCtlr.value
      this.tasks.update(
        task =>{
          return task.map((task,position) =>{
            if(position === index){
              return {
                ...task,
                title:newValue,
                edit:false
              }
            }
            return task
           }

          )
        }
      )
    }

  }

  changeFilter(filter:FILTERS){
    this.filter.set(filter);

  }
}
