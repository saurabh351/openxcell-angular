import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    ClassRoomInterface,
    ProfessorInterface, ProfessorSubjectInterface,
    SubjectInterface,
    TimeSlotInterface,
    TimeTableInterface,
    WeekDayInterface
} from '../../@core/interfaces';
import { CollegeService } from '../../@core/services/college.service';


interface TimeTableDataMappingInterface {
    [index:number]: {
        [index:number]: Partial<{
            [index:number]: TimeTableInterface;
        }>;
    };
}
interface ProfessorTimeTableDataMappingInterface {
    [index:number]: {
        [index:number]: Partial<{
            [index:number]: TimeTableInterface[];
        }>;
    };
}


@Component({
    selector: 'ngx-dashboard',
    styleUrls: ['./dashboard.component.scss'],
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy {
    timeTableDataLoaded = false;
    cardView = 'classRoom';
    professorViewLoaded = false;

    dataMapping: TimeTableDataMappingInterface = {};
    professorTimeTableDataMapping: ProfessorTimeTableDataMappingInterface = {};
    professorDataMapping: {
        [index:number] : ProfessorInterface
    } = {};
    subjectDataMapping: {
        [index:number] : SubjectInterface
    } = {};
    defaultOptionValue = 'all';
    timeTableRows: TimeTableInterface[] = [];
    subjects: SubjectInterface[] = [];
    professors: ProfessorInterface[] = [];
    timeSlots: TimeSlotInterface[] = [];
    weekDays: WeekDayInterface[] = [];
    classRooms: ClassRoomInterface[] = [];


    selectedWeekDay?: string = 'all';
    selectedClassRoom?: string = 'all';
    selectedTimeSlot?: string = 'all';
    selectedProfessor?: string = 'all';
    isEditMode: boolean = false;

    currentWeekDays: WeekDayInterface[] = [];


    slotSelection: TimeTableInterface = null;
    isSubmiting: boolean = false;
    errorMessage: string = '';

    form = new FormGroup({
        id: new FormControl(''),
        class_room_id: new FormControl('', Validators.required),
        professor_id: new FormControl('', Validators.required),
        subject_id: new FormControl('', Validators.required),
        day_id: new FormControl('', Validators.required),
        time_slot_id: new FormControl('', Validators.required),
    });


    constructor(private service: CollegeService) {
        this.loadData();
    }

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
    }

    onSubmit(){
        this.isSubmiting = true;

        this.service.attachClassRoom(this.form.value).subscribe(
            (data: any) => {
                this.isSubmiting = false;
                this.slotSelection = null;
                this.form.reset();
                this.refreshTimeTable();
                this.errorMessage = '';
            },
            error => {
                this.isSubmiting = false;
                this.errorMessage = error.error.message || error.message;
                console.log(error)
            }
        );
    }

    cancelForm() {
        this.slotSelection = null;
        this.form.reset();
        this.errorMessage = '';
    }


    assignProfessor(classRoomId, timeSlotId, weekDayId) {
        const info: TimeTableInterface | null =  this.dataMapping[classRoomId][weekDayId][timeSlotId] ?
            this.dataMapping[classRoomId][weekDayId][timeSlotId] : null;

        if (info) {
            this.slotSelection = info;
            this.form.patchValue({
                id : this.slotSelection.id,
                class_room_id : this.slotSelection.class_room_id,
                professor_id : this.slotSelection.professor_id,
                day_id : this.slotSelection.day_id,
                time_slot_id : this.slotSelection.time_slot_id,
                subject_id : this.slotSelection.subject_id,
            });

            let el = document.getElementById('assignHead');
            el.scrollIntoView({
                block : 'start'
            });
        }
    }

    changeWeekDay($event) {
        this.selectedWeekDay = $event;
        this.refreshTimeTable();
        this.currentWeekDays = this.weekDays.filter((weekDay : WeekDayInterface) => {
            return this.selectedWeekDay === 'all' || Number(weekDay.id) == Number(this.selectedWeekDay);
        });
    }

    changeClassRoom($event) {
        this.selectedClassRoom = $event;
        this.refreshTimeTable();
    }
    changeTimeSlot($event) {
        this.selectedTimeSlot = $event;
        this.refreshTimeTable();
    }

    getProfessorItems(professorId, dayId, timeSlotId) {
        if(
            this.professorDataMapping[professorId] &&
            this.professorDataMapping[professorId][dayId] &&
            this.professorDataMapping[professorId][dayId][timeSlotId]
        ) {
            return this.professorDataMapping[professorId][dayId][timeSlotId];
        }
        return [];
    }

    loadData() {
        this.service.getConfigTimeSlots().subscribe(
            (data: any) => {
                this.timeSlots = data;
            },
            error => console.log(error)
        );
        this.service.getConfigWeekDays().subscribe(
            (data: any) => {
                this.weekDays = data;
                this.currentWeekDays = data;
            },
            error => console.log(error)
        );
        this.service.getAllClassRooms().subscribe(
            (data: any) => {
                this.classRooms = data;
            },
            error => console.log(error)
        );
        this.service.getAllSubjects().subscribe(
            (data: any) => {
                this.subjects = data;
                for(let i = 0; i<this.subjects.length; i++){
                    this.subjectDataMapping[this.subjects[i].id] = this.subjects[i];
                }
            },
            error => console.log(error)
        );
        this.service.getAllProfessors().subscribe(
            (data: any) => {
                this.professors = data.map((professor : ProfessorInterface) => {
                    professor.subjects = (professor.subjects as ProfessorSubjectInterface[]).map((item : ProfessorSubjectInterface) => {
                        return item.subject_id;
                    }) as string[];
                    return professor;
                });
                for(let i = 0; i<this.professors.length; i++){
                    this.professorDataMapping[this.professors[i].id] = this.professors[i];
                }
            },
            error => console.log(error)
        );

        this.refreshTimeTable();
    }

    refreshTimeTable() {
        let filterOptions: any = {};

        if (this.selectedClassRoom != 'all') {
            filterOptions.class_room_id = parseInt(this.selectedClassRoom);
        }
        if (this.selectedProfessor != 'all') {
            filterOptions.professor_id = parseInt(this.selectedProfessor);
        }
        if (this.selectedWeekDay != 'all') {
            filterOptions.day_id = parseInt(this.selectedWeekDay);
        }
        if (this.selectedTimeSlot != 'all') {
            filterOptions.time_slot_id = parseInt(this.selectedTimeSlot);
        }
        this.timeTableDataLoaded = false;
        this.service.getTimetable(filterOptions).subscribe(
            (data: any) => {
                this.transformTimeTableData(data);
            },
            error => console.log(error)
        );
    }

    transformTimeTableData(items : TimeTableInterface[])
    {
        this.timeTableRows = items;
        this.dataMapping = {};
        this.professorTimeTableDataMapping = {};
        for (let i = 0; i<items.length; i++){
            let item = items[i];
            if (Number(item.professor_id) > 0) {
                if (!this.professorTimeTableDataMapping[item.professor_id]) {
                    this.professorTimeTableDataMapping[item.professor_id] = {};
                }
                if (!this.professorTimeTableDataMapping[item.professor_id][item.day_id]) {
                    this.professorTimeTableDataMapping[item.professor_id][item.day_id] = {};
                }
                if (!this.professorTimeTableDataMapping[item.professor_id][item.day_id][item.time_slot_id]) {
                    this.professorTimeTableDataMapping[item.professor_id][item.day_id][item.time_slot_id] = [];
                }
                this.professorTimeTableDataMapping[item.professor_id][item.day_id][item.time_slot_id].push(item);
            }

            if (!this.dataMapping[item.class_room_id]) {
                this.dataMapping[item.class_room_id] = {};
            }
            if (!this.dataMapping[item.class_room_id][item.day_id]) {
                this.dataMapping[item.class_room_id][item.day_id] = {};
            }
            this.dataMapping[item.class_room_id][item.day_id][item.time_slot_id] = item;
        }
        this.timeTableDataLoaded = true;
        this.professorViewLoaded = true;
    }

    isExist(classRoomId, timeSlotId, weekDayId) {
        return this.dataMapping[classRoomId][weekDayId][timeSlotId] || null;
    }
    getDayInfo(classRoomId, timeSlotId, weekDayId) {
        try {
            let data = [];
            const info =  this.dataMapping[classRoomId][weekDayId][timeSlotId] ?
                this.dataMapping[classRoomId][weekDayId][timeSlotId] : null;

            if(info && this.professorDataMapping[info.professor_id]){
                data.push(
                    this.professorDataMapping[info.professor_id].name
                )
            }

            if(info && this.subjectDataMapping[info.subject_id]){
                data.push(
                    `(${this.subjectDataMapping[info.subject_id].name})`
                )
            }
            if(data.length === 0) {
                return '-';
            }
            return data.join(' ');
        } catch (e) {
            return '-';
        }
    }
    getDayInfoByProfessor(info : TimeTableInterface) {
        try {
            let data = [];
            if(info && this.subjectDataMapping[info.subject_id]){
                data.push(
                    `(${this.subjectDataMapping[info.subject_id].name})`
                )
            }
            if(data.length === 0) {
                return 'Unknown';
            }
            return data.join(' ');
        } catch (e) {
            return 'Unknown';
        }
    }

    ngOnDestroy() {
        this.timeTableRows = [];
        this.classRooms = [];
        this.subjects = [];
        this.professors = [];
        this.timeSlots = [];
        this.weekDays = [];
    }
}
