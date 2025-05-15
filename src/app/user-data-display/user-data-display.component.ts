import { Component, Input, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GroupedSubmission } from '../interfaces/grouped-submission';

//Combining User Data Dispay and User Data Dialog
//Into a single script with two components
//As per Angular Material's Example Documentation

//MATERIAL DIALOG IMPORTS
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
import { GroupedData } from '../interfaces/grouped-data';
import { subscribeOn } from 'rxjs';
import { UserRole } from '../interfaces/user-role';

//Interface for Editable values within the dialog
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
//MATERIAL DIALOG COMPONENT
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
  //Inject Material Dialog with our Edit Dialog Class
  readonly dialogRef = inject(MatDialogRef<EditDialog>);
  //Inject the Edit Data interface with Dialog Data Class
  readonly data = inject<EditData>(MAT_DIALOG_DATA);
  //Create a Bindable Model for form data
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
  //On Cancel
  onNoClick(): void {
    this.dialogRef.close();
  }

  save() {
    //Update data and close dialog
    this.dialogRef.close(this.data);
  }
}

//USER DATA DISPLAY COMPONENT
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
  //Input Variable for User Data, sent via parent component
  @Input() userData: GroupedSubmission[] = [];
  //Input variable for Material Expansion Panels collapsed status
  @Input() expanded: boolean = false;
  //Track if edit dialog is open
  public editing: boolean = false;
  //
  public editingID: number = -1;
  //Form Group
  form!: FormGroup;
  //Current User's Role
  public userRole = ''

  panelStatus: boolean[] = [];

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    //Create new Form Group
    this.form = new FormGroup({});

    //TODO: Create Array for each panel's expanded status
    //Maintain expanded status for currently open panel
    //across refresh
    
    // this.userData.forEach(() =>{
    //   this.panelStatus.push(false);
    // });
    // console.log(this.panelStatus)

  }

  //Create Signal for Edit Data to
  //communciate between dialog and component
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

  //Inject dialog with MatDialog
  readonly dialog = inject(MatDialog);
  openDialog() {
    //Open Dialog Window and Fill Data from Parent Component
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
      //If values are valid
      if (result !== undefined) {
        console.log(result);
        //Update Edit Data Signal
        this.editData.set(result);
        //Edit Submission Values in DB
        this.updateSubmission(result);
      }
    });
  }

  //Edit Submssion values in DB
  updateSubmission(result: EditData) {
    //API URL
    let url = `${environment.baseURL}api/Submission/Edit`;
    //PUT Request
    this.http.put(url, result).subscribe({
      next: (res) => {
        console.log("Data Edited Succesfully")
        console.log(res);
      },
      error: (e) => console.error(e)
    });
  }

  //When Edit Button Is pressed
  //Parameters:
  //OriginID -> Used to Edit Submssion in DB
  //ID -> SubmssionID for editing Submission in DB
  //i & j -> indices to pull data from the stored UserData
  edit(originID: string, id: number, i: number, j: number) {
    //Set editing status to true
    this.editing = true;
    //Get the editingID
    this.editingID = id;
    //Populate the Edit Data Signal values with corresponding user data
    this.editData.set({
      Id: id,
      r_s: this.userData[i].submittedValues[j].r_s,
      f_p: this.userData[i].submittedValues[j].f_p,
      n_e: this.userData[i].submittedValues[j].n_e,
      f_i: this.userData[i].submittedValues[j].f_i,
      f_l: this.userData[i].submittedValues[j].f_l,
      f_c: this.userData[i].submittedValues[j].f_c,
      l: this.userData[i].submittedValues[j].l,
      origin: originID
    });
    //Open up the dialog
    this.openDialog();
  }
  //Deletes Entry
  delete(submissionID: number) {
    //Takes in Submssion ID and delets it from the Database
    let url = `${environment.baseURL}api/Submission/Delete/${submissionID}`;
    this.http.delete(url).subscribe({
      next: (res) => {
        console.log("Entry Deleted");
      },
      error: (e) => console.error(e)
    });
  }

}
