import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";

@Component({
  selector: 'sd-email-prompt-dialog',
  template: `
    <form>
      <h1 mat-dialog-title>Enter your email to continue</h1>
      <div mat-dialog-content>
        <mat-form-field>
          <input type="email" name="email" matInput [(ngModel)]="email" required>
        </mat-form-field>
      </div>
      <div mat-dialog-actions>
        <button type="submit" mat-raised-button color="primary" [mat-dialog-close]="email" cdkFocusInitial 
                placeholder="yours@example.com">CONTINUE</button>
      </div>
    </form>
  `,
})
export class EmailPromptDialogComponent {
  email: string;

  constructor(
    public dialogRef: MatDialogRef<EmailPromptDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
