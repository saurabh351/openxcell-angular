import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfessorInterface, ProfessorSubjectInterface, SubjectInterface } from '../../../@core/interfaces';
import { CollegeService } from '../../../@core/services/college.service';


@Component({
    selector: 'professor-management-card',
    templateUrl: 'professor-management-card.component.html',
    styleUrls: ['professor-management-card.component.scss'],
})
export class ProfessorManagementCardComponent {
    professors: ProfessorInterface[] = [];
    subjects: SubjectInterface[] = [];

    dataLoading: boolean = true;

    professorForm: FormGroup;

    constructor(private service: CollegeService) {
        this.initForm();
        this.loadData();
    }

    initForm() {
        this.professorForm = new FormGroup({
            name: new FormControl('', Validators.required),
            subjects: new FormControl([null], Validators.required),
            id: new FormControl(null),
        });
    }

    getSubjectIds(subjects: any[]) {
        if (!subjects) {
            return [];
        }
        return subjects.map((subject: any) => subject.subject_id)
    }

    editProfessor(professor: ProfessorInterface) {
        this.professorForm.patchValue({
            id: professor.id,
            name: professor.name,
            subjects: (professor.subjects as ProfessorSubjectInterface[]).map((sub: any) => sub.subject_id),
        });
    }

    deleteProfessor(professor: ProfessorInterface, index) {
        this.service.deleteProfessors(professor.id).subscribe(
            (data: any) => {
                this.professors.splice(index, 1);
            },
            error => console.log(error)
        );
    }

    onSubmit() {
        let formData = this.professorForm.value;
        this.service.addNewProfessors(formData).subscribe(
            (data: ProfessorInterface) => {
                this.initForm();
                if (!formData.update) {
                    this.professors.push(data);
                    return;
                }

                this.professors.forEach((item: ProfessorInterface, index) => {
                    if (item.id == data.id) {
                        this.professors[index] = data;
                    }
                });
            },
            error => console.log(error)
        );
    }

    loadData() {
        this.dataLoading = true;
        this.service.getAllSubjects().subscribe(
            (data: any) => {
                this.subjects = data;
            },
            error => {
                console.log(error)
            }
        );
        this.service.getAllProfessors().subscribe(
            (data: any) => {
                this.professors = data;
                this.dataLoading = false;
            },
            error => {
                this.dataLoading = false;
                console.log(error)
            }
        );
    }
}
