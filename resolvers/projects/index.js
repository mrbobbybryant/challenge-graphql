import { gql } from 'apollo-server-express';
import { adminAuth } from 'shared/authenticated';

//Mutations
import createProject from './mutations/create-project'

//Queries

const typeDefs = gql`
    type Project {
        id: Int!
        name: String!
        description: String
        user_id: Int!
    }

    type ProjectList {
        results: [Project]
        count: Int
    }

    input CreateProjectInput {
        name: String!
        description: String
    }
`

const resolvers = {
    Mutation:{
        createProject: (parent, args, context, info) =>
        createProject(parent, args, context, info)
    }
}

export default { resolvers, typeDefs };