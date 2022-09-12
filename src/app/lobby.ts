export interface Lobby { 
    id: string,
    leader: string, 
    members: Array<string>,
    tasks: Array<string>,
}

export const tasks = [
    {
        id: 1,
        task: "Do 10 pushups"
    },
    {
        id: 2,
        task: "Talk to your friend"
    },
    {
        id: 3,
        task: "Know your friend's name"
    },
]