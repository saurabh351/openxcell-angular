interface TimeSlotInterface {
    id: number;
    fromTime: string;
    toTime: string;
}

interface WeekDayInterface {
    id: number;
    day: string;
    date?: string;
}

interface SubjectInterface {
    id: number;
    name: string;
}

interface TimeTableInterface {
    id: number;
    class_room_id: number;
    day_id: number;
    time_slot_id: number;
    professor_id?: number;
    subject_id?: number;
}

interface ProfessorSubjectInterface {
    id: number;
    professor_id: number;
    subject_id: number | string;
}

interface ProfessorInterface {
    id: number;
    name: string;
    subjects: string[] | ProfessorSubjectInterface[];
}
interface ClassRoomInterface {
    id: number;
    name: string;
}


export {
    TimeSlotInterface,
    WeekDayInterface,
    SubjectInterface,
    TimeTableInterface,
    ProfessorInterface,
    ClassRoomInterface,
    ProfessorSubjectInterface,
};
