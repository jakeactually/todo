import TodoForm from "@/components/form";
import { Todo, TodoInput } from "@/helpers/types";
import { gql } from "@apollo/client";
import ApolloClient from '../helpers/apollo-client';
import _ from 'lodash';
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import Image from 'next/image';

const saveTodoMutation = gql`
  mutation Mutation($todo: TodoInput) {
    createTodo(todo: $todo) {
        title
    }
  }
`;

export default () => {
    const router = useRouter();
    const [todo, setTodo] = useState<Todo>({
        rowid: 0,
        title: '',
        deadline: '',
        startTime: '',
        endTime: '',
        remind: 0,
        repeat: '',
        status: ''
    });

    const saveTodo = async () => {
        await ApolloClient.mutate({
            mutation: saveTodoMutation,
            variables: { todo: _.omit(todo, 'rowid') }
        });
        router.push('/');
    };

    return <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <header style={{ display: 'flex', alignItems: 'center' }}>
            <Image
                onClick={() => router.push('/')}
                src="/left-arrow.png"
                alt=""
                width={20}
                height={20}
                style={{ marginRight: 10 }} />
            <h1>Add task</h1>
        </header>
        <hr />
        <main style={{ flexGrow: 1 }}>
            <TodoForm todo={todo} onChange={setTodo} />
        </main>
        <footer>
            <button onClick={saveTodo}>Create a Task</button>
        </footer>
    </div>;
};
