const exp = require('express');
const expGraphql = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
} = require('graphql');




const app = exp();


const authors = [
    {
        id:1,
        name:"Mathias Boampong"
    },  
    {
        id:2,
        name:"Benjamin Domey"
    },
    {
        id:3,
        name:"Eben Nyarko"
    }
]

const books = [
    {
        id:1,
        name:"learn Graphql",
        author_id:1,
    },
    {
        id:2,
        name:"learn C#",
        author_id:2,
    },
    {
        id:3,
        name:"learn React",
        author_id:3,
    },
    {
        id:4,
        name:"learn Entrepreneurship",
        author_id:3,
    },
    {
        id:5,
        name:"learn Mongodb",
        author_id:2,
    },
    {
        id:6,
        name:"learn Nodejs",
        author_id:1,
    },
    {
        id:7,
        name:"learn C",
        author_id:2,
    }, 
    {
        id:1,
        name:"learn C++",
        author_id:3,
    }
]
const authorType = new GraphQLObjectType({
    name:'Author',
    description:'This represensts the name of the writer of a book',
    fields:() =>({
        id:{
            type:GraphQLNonNull(GraphQLInt)
        },
        name:{
            type:GraphQLNonNull(GraphQLString)
        },
        books:{
            type: GraphQLList(bookType),
            resolve: (author) => {
                return  books.filter(book => book.author_id === author.id)
            }
        }
    })
})

const bookType = new GraphQLObjectType({
    name:'Book',
    description:'This represents a book written by an author',
    fields: () =>({
        id:{
            type: GraphQLNonNull(GraphQLInt)
        },
        name:{
            type: GraphQLNonNull(GraphQLString) 
        },
        author_id:{
            type:GraphQLNonNull(GraphQLInt)
        },
        author:{
            type: GraphQLNonNull(authorType),
            resolve:(book)=>{
                return authors.find(author => author.id === book.author_id);
            }
        }
    })
});



// create root query scope

const rootQueryType = new GraphQLObjectType({
    name:'Query',
    description:'Root Query',
    fields: () =>({
        book:{
            type: bookType,
            description: 'single book',
            args:{
                id:{
                    type:GraphQLInt
                }
            },
            resolve:(parent,args)=>{
                return books.find(book => book.id === args.id)
            }
        },
        books:{
            type: new GraphQLList(bookType),
            description:'List of all books',
            resolve: () => books
        },
        authors:{
            type:new GraphQLList(authorType),
            description:'list of all authors of a book',
            resolve:()=> authors
        },
        author:{
            type: authorType,
            args:{
                id:{
                    type:GraphQLInt
                }
            },
            description:'A single author of a book',
            resolve:(parent,args)=> {
                return authors.find(author => author.id === args.id)
            }
        }

    })
})

const rootMutationType = new GraphQLObjectType({
    name:'Mutation',
    description:'root mutaion',
    fields:()=> ({
        addBook:{
            type:bookType,
            description:'add new book',
            args:{
                name:{
                    type: GraphQLNonNull(GraphQLString)
                },
                author_id:{
                    type:GraphQLNonNull(GraphQLInt)
                }
            },
            resolve: (parent,args) =>{
                const book = {
                    id:books.length +1,
                    name:args.name,
                    author_id:args.author_id
                }
                books.push(book);
                return book
            }
        },
        addAuthor:{
            type:authorType,
            description:'add single author',
            args:{
                name:{
                    type:GraphQLNonNull(GraphQLString)
                }
            },
            resolve:(parent,args)=>{
                const author = {
                    id:authors.length + 1,
                    name:args.name
                }
                authors.push(author);
                return author

            }
        }
    })
})


const schema = new GraphQLSchema({
    query:rootQueryType,
    mutation:rootMutationType
})


app.use('/graphql' ,expGraphql({
    schema:schema,
    graphiql:true
}))
const port = 5000;
app.listen(port,()=>{
    console.log(`server listening on port ${port}`);
    
}); 