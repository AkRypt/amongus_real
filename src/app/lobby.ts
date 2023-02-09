export interface Lobby { 
    id: string,
    leader: string, 
    members: Array<string>,
    tasks: Array<string>,
}

export const tasks = [
    {
        tid: 0,
        task: "Do 10 pushups",
        isDone: false,
    },
    {
        tid: 1,
        task: "Talk to your friend",
        isDone: false,
    },
    {
        tid: 2,
        task: "Know your friend's name",
        isDone: false,
    },
]