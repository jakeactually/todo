import Image from 'next/image';
import { Inter } from 'next/font/google';
import ApolloClient from '../helpers/apollo-client';
import { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import TodoForm from '../components/form';
import Head from 'next/head';
import { Todo } from '@/helpers/types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import _ from 'lodash';

const inter = Inter({ subsets: ['latin'] })

const todosQuery = gql`
  query Query {
    getTodos {
      rowid
      title
      status
    }
  }
`;

const updateTodoMutation = gql`
  mutation Mutation($id: Int, $todo: TodoInput) {
    updateTodo(id: $id, todo: $todo) {
      title
    }
  }
`;

export default function Home() {
  const [todos, setTodos] = useState([] as Todo[]);
  const [tab, setTab] = useState('all');
  const router = useRouter();

  const fetchTodos = () => {
    ApolloClient.query({ query: todosQuery }).then(result => {
      setTodos(result.data.getTodos);
    });
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  const toggleTodo = async (todo: Todo) => {
    const { rowid, __typename, ...newTodo } = {
      ...todo,
      status: todo.status == 'completed' ? 'uncompleted' : 'completed'
    };
    const variables = { id: rowid, todo: newTodo };
    await ApolloClient.mutate({ mutation: updateTodoMutation, variables });
    fetchTodos();
  };

  return <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h1>Board</h1>
      <div style={{ display: 'flex' }}>
        <Image src="/search.png" alt="" width={20} height={20} style={{ marginRight: 5 }} />
        <Image src="/bell.png" alt="" width={20} height={20} style={{ marginRight: 5 }} />
        <Image src="/menu.png" alt="" width={20} height={20} />
      </div>
    </header>
    <hr />
    <nav>
        <ul style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '10px 0px',
          fontSize: '0.8em',
          color: '#999',
          cursor: 'pointer'
        }}>
          {['all', 'completed', 'uncompleted', 'favorite'].map(t =>
          <li
            className={ t == tab ? 'selected' : '' }
            onClick={() => setTab(t)}>
            {_.capitalize(t)}
          </li>)}
        </ul>
    </nav>
    <hr />
    <main style={{ flexGrow: 1 }}>
      {todos.filter(t => tab == 'all' || t.status == tab).map(todo => <>
        <div className="todo" style={{ marginBottom: 10 }} key={todo.rowid}>
          <input
            type="checkbox"
            style={{ marginRight: 20 }}
            checked={todo.status == 'completed'}
            onChange={() => toggleTodo(todo)} />
          {todo.title}
        </div>
      </>)}
    </main>
    <footer>
      <Link href={'/add-todo'}>
        <button>Add a Task</button>
      </Link>
    </footer>
  </div>;
};
