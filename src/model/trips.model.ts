import pool from "../connect"

export type Trip = {
    id : number,
    name : string,
    description : string,
    durationMinutes : number,
    startLatitiude : number,
    startLongitude : number,
    maxParticipants : number,
    basePrice : number,
    createdAt : Date
    //tags? : TripTag[]
}

type TripRow = {
    id : number,
    name : string,
    description : string,
    durationminutes : number,
    startlatitude : string,
    startlongitude : string,
    maxparticipants : number,
    basePrice : number,
    createdat : Date,
    active : boolean,
    //tags? : TripTag[]
}

function rowToTrip(row : TripRow) : Trip {
    return {
        id : row.id,
        name : row.name,
        description : row.description,
        durationMinutes : row.durationminutes,
        startLatitiude : Number(row.startlatitude),
        startLongitude : Number(row.startlongitude),
        maxParticipants : row.maxparticipants,
        basePrice : row.basePrice,
        createdAt : row.createdat,
    };
}

class Trips {

}

export const trips = new Trips();