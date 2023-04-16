import { resolvers } from '@/helpers/resolver';
import { Todo } from '@/helpers/types';
import { createYoga, createSchema } from 'graphql-yoga';


const typeDefs = `
  type Query {
    getTodos: [Todo]
  }

  type Mutation {
    createTodo(todo: TodoInput): Todo
    updateTodo(id: Int, todo: TodoInput): Todo
    deleteTodo(id: Int): Todo
  }

  type Todo {
    rowid: Int
    title: String
    deadline: String
    startTime: String
    endTime: String
    remind: Int
    repeat: String
    status: String
  }

  input TodoInput {
    title: String
    deadline: String
    startTime: String
    endTime: String
    remind: Int
    repeat: String
    status: String
  }
`;



const schema = createSchema({
  typeDefs,
  resolvers,
});

export const config = {
  api: {
    // Disable body parsing (required for file uploads)
    bodyParser: false,
  },
};

export default createYoga({
  schema,
  // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
  graphqlEndpoint: '/api/graphql',
});
