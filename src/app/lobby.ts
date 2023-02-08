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
    },
    {
        tid: 1,
        task: "Talk to your friend",
    },
    {
        tid: 2,
        task: "Know your friend's name",
    },
]