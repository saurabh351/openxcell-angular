import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClassRoomInterface, SubjectInterface } from '../../../@core/interfaces';
import { CollegeService } from '../../../@core/services/college.service';


@Component({
    selector: 'class-room-management-card',
    templateUrl: 'class-room-management-card.component.html',
    styleUrls: ['class-room-management-card.component.scss'],
})
export class ClassRoomManagementCardComponent {
    classRooms: ClassRoomInterface[] = [];

    dataLoading: boolean = true;

    classRoomForm = new FormGroup({
        name: new FormControl('', Validators.required),
        id: new FormControl(null),
    });

    constructor(private service: CollegeService) {
        this.loadData();
    }

    editClassRoom(subject: SubjectInterface) {
        this.classRoomForm.patchValue({
            id: subject.id,
            name: subject.name,
        });
    }

    deleteClassRoom(subject: SubjectInterface, index) {
        this.service.deleteClassRoom(subject.id).subscribe(
            (data: any) => {
                this.classRooms.splice(index, 1);
            },
            error => console.log(error)
        );
    }

    onSubmit() {
        let formData = this.classRoomForm.value;
        this.service.addNewClassRoom(formData).subscribe(
            (data: ClassRoomInterface) => {
                this.classRoomForm.reset();
                if (!formData.update) {
                    this.classRooms.push(data);
                    return;
                }

                this.classRooms.forEach((item : ClassRoomInterface, index) => {
                    if (item.id == data.id) {
                        this.classRooms[index] = data;
                    }
                });
            },
            error => console.log(error)
        );
    }

    loadData() {
        this.dataLoading = true;
        this.service.getAllClassRooms().subscribe(
            (data: any) => {
                this.classRooms = data;
                this.dataLoading = false;
            },
            error => {
                this.dataLoading = false;
                console.log(error)
            }
        );
    }

}
