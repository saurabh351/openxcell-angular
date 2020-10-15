import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
    ClassRoomInterface,
    ProfessorInterface,
    SubjectInterface,
    TimeSlotInterface,
    TimeTableInterface,
    WeekDayInterface,
} from '../interfaces';

@Injectable()
export class CollegeService {
    public readonly apiUrl: string;

    constructor(private http: HttpClient) {
        this.apiUrl = environment.apiUrl;
    }

    getAllProfessors() {
        return this.http.get<ProfessorInterface[]>(`${this.apiUrl}/professors`);
    }

    getConfigWeekDays() {
        return this.http.get<WeekDayInterface[]>(`${this.apiUrl}/config/week-days`);
    }

    getConfigTimeSlots() {
        return this.http.get<TimeSlotInterface[]>(`${this.apiUrl}/config/time-slots`);
    }

    getTimetable(filterOptions: any = {}) {
        return this.http.post<TimeTableInterface[]>(`${this.apiUrl}/professors/timetable`, filterOptions);
    }

    addNewProfessors(data: any) {

        if (data.subjects.length && !data.subjects[0]) {
            data.subjects.splice(0, 1);
        }

        if (data.id) {
            data.update = true;
            return this.updateProfessors(data.id, data);
        } else {
            return this.http.post<ProfessorInterface>(`${this.apiUrl}/professors`, data);
        }
    }

    updateProfessors(id: number, data: any) {
        return this.http.patch<ProfessorInterface>(`${this.apiUrl}/professors/${id}`, data);
    }

    deleteProfessors(id: number) {
        return this.http.delete<{ isDeleted: boolean; }>(`${this.apiUrl}/professors/${id}`);
    }

    getAllSubjects() {
        return this.http.get<SubjectInterface[]>(`${this.apiUrl}/subjects`);
    }

    addNewSubject(data: any) {
        if (data.id) {
            data.update = true;
            return this.updateSubject(data.id, data);
        }
        return this.http.post<SubjectInterface>(`${this.apiUrl}/subjects`, data);
    }

    updateSubject(id: number, data: any) {
        return this.http.patch<SubjectInterface>(`${this.apiUrl}/subjects/${id}`, data);
    }

    deleteSubject(id: number) {
        return this.http.delete<{ isDeleted: boolean; }>(`${this.apiUrl}/subjects/${id}`);
    }

    getAllClassRooms() {
        return this.http.get<ClassRoomInterface[]>(`${this.apiUrl}/class-room`);
    }

    addNewClassRoom(data: any) {
        if (data.id) {
            data.update = true;
            return this.updateClassRoom(data.id, data);
        }
        return this.http.post<ClassRoomInterface>(`${this.apiUrl}/class-room`, data);
    }

    updateClassRoom(id: number, data: any) {
        return this.http.patch<ClassRoomInterface>(`${this.apiUrl}/class-room/${id}`, data);
    }

    deleteClassRoom(id: number) {
        return this.http.delete<{ isDeleted: boolean }>(`${this.apiUrl}/class-room/${id}`);
    }

    attachClassRoom(data: any) {
        return this.http.post<any>(`${this.apiUrl}/professors/attach-class-room`, data);
    }
}
