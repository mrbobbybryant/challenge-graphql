import { gql } from 'apollo-server-express';

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
    myProjects: [Project]
    projectsByUser(id: Int!) : [Project]
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
