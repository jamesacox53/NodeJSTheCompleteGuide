const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageURL: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }    

    type User {
        _id: ID!
        name: String!
        password: String
        status: String!
        posts: [Post!]!
    }

    type AuthData {
        token: String!
        userID: String!
    }

    type PostData {
        posts: [Post!]!
        totalPosts: Int!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    input PostInputData {
        title: String!
        content: String!
        imageURL: String!
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
        posts: PostData!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
        createPost(postInput: PostInputData): Post!
    }

    schema {
        mutation: RootMutation
        query: RootQuery
    }
`);