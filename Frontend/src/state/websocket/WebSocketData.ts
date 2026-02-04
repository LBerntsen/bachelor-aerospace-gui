interface WebSocketInitial
{
    type: "initial"
    data: SensorDataDto[]
}

interface WebSocketUpdate
{
    type: "update"
    data: SensorDataDto
}

interface SensorDataDto
{
    TimeStamp: string
    Id: string
    Value: number
}

export type WebSocketData = WebSocketInitial | WebSocketUpdate