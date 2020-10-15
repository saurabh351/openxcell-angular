import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SubjectInterface } from '../../../@core/interfaces';
import { CollegeService } from '../../../@core/services/college.service';


@Component({
    selector: 'subjects-management-card',
    templateUrl: 'subjects-management-card.component.html',
    styleUrls: ['subjects-management-card.component.scss'],
})
export class SubjectsManagementCardComponent {
    subjects: SubjectInterface[] = [];

    isSubmiting: boolean = false;

    dataLoading: boolean = true;

    subjectForm = new FormGroup({
        name: new FormControl('', Validators.required),
        id: new FormControl(null),
    });

    constructor(private service: CollegeService) {
        this.loadData();
    }

    editSubject(subject: SubjectInterface) {
        this.subjectForm.patchValue({
            id: subject.id,
            name: subject.name,
        });
    }

    deleteSubject(subject: SubjectInterface, index) {
        this.service.deleteSubject(subject.id).subscribe(
            (data: any) => {
                this.subjects.splice(index, 1);
            },
            error => console.log(error),
        );
    }

    onSubmit() {
        this.isSubmiting = true;
        const formData = this.subjectForm.value;
        this.service.addNewSubject(formData).subscribe(
            (data: SubjectInterface) => {

                this.subjectForm.reset();
                this.isSubmiting = false;

                if (!formData.update) {
                    this.subjects.push(data);
                    return;
                }

                this.subjects.forEach((subject: SubjectInterface, index) => {
                    if (subject.id == data.id) {
                        this.subjects[index] = data;
                    }
                });
            },
            error => console.log(error),
        );
    }

    loadData() {
        this.dataLoading = true;
        this.service.getAllSubjects().subscribe(
            (data: any) => {
                this.subjects = data;
                this.dataLoading = false;
            },
            error => {
                this.dataLoading = false;
                console.log(error);
            },
        );
    }

}
