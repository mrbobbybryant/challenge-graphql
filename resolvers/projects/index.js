import { gql } from 'apollo-server-express';
import  getUser from '../users/queries/get-user';



//Mutations
import createProject from './mutations/create-project'

//Queries
import myProjects from './queries/my-projects'
import projectsByUser from './queries/projects-by-user'


const typeDefs = gql`
    type Project {
        id: Int!
        name: String!
        description: String
        user_id: Int!
        user: User
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
    Query:{
        myProjects,
        projectsByUser
    },
    Mutation:{
        createProject
    },
    Project: {
         user(parent){
            return getUser({}, {id: parent.user_id})
        }
    }
}

export default { resolvers, typeDefs };