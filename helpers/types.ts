export type Todo = {
    rowid: number;
} & TodoInput;

export type TodoInput = {
    __typename?: string;
    title: string;
    deadline: string;
    startTime: string;
    endTime: string;
    remind: number;
    repeat: string;
    status: string;
};
