import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { getProgress } from 'src/helpers/progress';
import { ranks } from 'src/helpers/ranks';
import { Rank } from 'src/models/rank';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import { members } from 'src/helpers/members';
import { Member } from 'src/models/member';

const ELEMENT_DATA: Member[] = members;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'maplestory-abyssal-expedition';
  ranks: Rank[] = ranks;

  displayedColumns: string[] = ['name', 'time', 'action'];
  dataSource: Member[] = localStorage.getItem('members') ? JSON.parse(localStorage.getItem('members') as string) as Member[] : ELEMENT_DATA;
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;

  progress: any[];

  protected form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      rankName: [undefined, [Validators.required]],
      reputation: [0, Validators.required],
      timeUsedToday: [0, [Validators.required]],
      hasRecruitedToday: [false, [Validators.required]],
    });
  }

  openDialog(action: any, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.addRowData(result.data);
      }else if(result.event == 'Update'){
        this.updateRowData(result.data);
      }else if(result.event == 'Delete'){
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(row_obj: any){
    var d = new Date();
    this.dataSource.push({
      id:d.getTime(),
      name:row_obj.name || d.getTime(),
      time: row_obj.time || 0
    });
    this.table.renderRows();
    localStorage.setItem('members', JSON.stringify(this.dataSource));
  }
  updateRowData(row_obj: any){
    this.dataSource = this.dataSource.filter((value,key)=>{
      if(value.id == row_obj.id){
        value.name = row_obj.name || row_obj.id;
        value.time = row_obj.time || 0;
      }
      return true;
    });
    localStorage.setItem('members', JSON.stringify(this.dataSource));
  }
  deleteRowData(row_obj: any){
    this.dataSource = this.dataSource.filter((value,key)=>{
      return value.id != row_obj.id;
    });
    localStorage.setItem('members', JSON.stringify(this.dataSource));
  }

  search() {
    this.progress = getProgress(this.form.value.rankName, this.form.value.reputation, this.form.value.hasRecruitedToday, this.form.value.timeUsedToday, structuredClone(this.dataSource));
  }
}
