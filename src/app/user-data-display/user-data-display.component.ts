import { Component, Input, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GroupedSubmission } from '../grouped-submission';

//DIALOG
import { ChangeDetectionStrategy, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GroupedData } from '../grouped-data';
import { subscribeOn } from 'rxjs';
import { UserRole } from '../user-role';

export interface EditData {
  Id: 0,
  r_s: 0,
  f_p: 0,
  n_e: 0,
  f_i: 0,
  f_l: 0,
  f_c: 0,
  l: 0,
  origin: ''
}

@Component({
  selector: 'user-data-dialog',
  templateUrl: 'user-data-dialog.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditDialog {
  readonly dialogRef = inject(MatDialogRef<EditDialog>);
  readonly data = inject<EditData>(MAT_DIALOG_DATA);
  readonly formData = model({
    Id: this.data.Id,
    r_s: this.data.r_s,
    f_p: this.data.f_p,
    n_e: this.data.n_e,
    f_i: this.data.f_i,
    f_l: this.data.f_l,
    f_c: this.data.f_c,
    l: this.data.l,
    origin: this.data.origin
  });

  onNoClick(): void {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.data);
  }
}
//DIALOG

@Component({
  selector: 'app-user-data-display',
  imports: [
    ReactiveFormsModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,],
  templateUrl: './user-data-display.component.html',
  styleUrl: './user-data-display.component.scss'
})
export class UserDataDisplayComponent implements OnInit {
  @Input() userData: GroupedSubmission[] = [];

  public editing: boolean = false;
  public editingID: number = -1;
  form!: FormGroup;
  public userRole = ''

  panelStatus:boolean[] = [];

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({});
    
    //ADD THIS FEATURE LATER
    // this.userData.forEach(() =>{
    //   this.panelStatus.push(false);
    // });
    // console.log(this.panelStatus)

    this.getUserRoles();
  }

  //DIALOG
  readonly editData = signal({
    Id: 0,
    r_s: 0,
    f_p: 0,
    n_e: 0,
    f_i: 0,
    f_l: 0,
    f_c: 0,
    l: 0,
    origin: ''
  });

  readonly dialog = inject(MatDialog);
  openDialog() {
    //OPEN DIALOG AND INJECT DATA
    const dialogRef = this.dialog.open(EditDialog, {
      data: {
        Id: this.editData().Id,
        r_s: this.editData().r_s,
        f_p: this.editData().f_p,
        n_e: this.editData().n_e,
        f_i: this.editData().f_i,
        f_l: this.editData().f_l,
        f_c: this.editData().f_c,
        l: this.editData().l,
        origin: this.editData().origin
      },
      width: "full"
    });

    //ON CLOSE UPDATE DATA INSIDE HERE
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        console.log(result);
        this.editData.set(result);
        this.updateSubmission(result);
      }
    });
  }
  //DIALOG

  updateSubmission(result:EditData){
    let url = `${environment.baseURL}api/Submission/Edit`;
    this.http.put(url, result).subscribe({
      next: (res) => {
        console.log("Data Edited Succesfully")
        console.log(res);
      },
      error: (e) => console.error(e)
    });    
  }

  edit(originID: string, id: number, i: number, j: number) {
    this.editing = true;
    this.editingID = id;

    this.editData.set({
      Id:id,
      r_s: this.userData[i].submittedValues[j].r_s,
      f_p: this.userData[i].submittedValues[j].f_p,
      n_e: this.userData[i].submittedValues[j].n_e,
      f_i: this.userData[i].submittedValues[j].f_i,
      f_l: this.userData[i].submittedValues[j].f_l,
      f_c: this.userData[i].submittedValues[j].f_c,
      l: this.userData[i].submittedValues[j].l,
      origin: originID
    });

    this.openDialog();
  }

  delete(originID: string, submissionID: number) {
    let url = `${environment.baseURL}api/Submission/Delete/${submissionID}`;
    this.http.delete(url).subscribe({
      next: (res) => {
        console.log("Entry Deleted");
      },
      error: (e) => console.error(e)
    });
  }

  getUserRoles() {
    let fetchedRole: UserRole[] = []
    let url = `${environment.baseURL}api/Admin/GetUserRole`;
    this.http.get<UserRole[]>(url).subscribe({
      next: (res) => {
        fetchedRole = res;
        this.userRole = fetchedRole[0].value;
        console.log(this.userRole);
      },
      error: (e) => console.error(e)
    });
  }

}
