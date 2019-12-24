import { gql } from 'apollo-server-express';

// You need to create a new set resolver called projects. Specifically you need to:

// Create a mutation for creating a new project
// Only logged in users should be able to create a project.
// The name of the project should be "required" in the graphql schema.
// The current user should be set as the user_id or owner for that project.
// Create a query to fetch all projects for a user
// Should only return that user's projects
// The Project type that you create should have a user field that allows you to fetch the User type.

export default gql`
  type Query {
    #Users
    getUsers(input: GetUsersInput!): UsersList
    me: User
    getCards: [Card]
    getCard(id: Int!): Card
    getUser(id: Int!): User
    getAllUsers: [User]
    test: Boolean

    #projects
  }

  type Mutation {
    #Auth
    signup(input: SignupInput!): User
    login(input: LoginInput!): User
    forgotPassword(cellphone: String!): Boolean!
    changePassword(input: UserChangePasswordInput!): User
    updatePassword(input: UpdatePasswordInput!): Boolean!

    #User
    updateUser(input: UpdateUserInput): User
    addCard(input: AddCardInput!): Boolean
    updateCard(input: UpdateCardInput!): Boolean
    deleteUser(id: Int!): Boolean
    createUser(input: CreateUserInput!): User
    updateSelf(input: UpdateSelfInput!): User

    #Images
    singleUpload(file: Upload!): File
    deleteUpload(id: Int!): Boolean

    #Projects
    createProject(input: CreateProjectInput!) : Boolean
  }

  type Rules {
    name: String!
    value: String!
  }

  enum SortDirection {
    ASC
    DESC
  }
`;
