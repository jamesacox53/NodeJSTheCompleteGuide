exports.getPosts = (request, response, next) => {
    response.status(200).json({
        posts: [
            { 
                _id: '1',
                title: 'First Post',
                content: 'This is the first post!',
                creator: {
                    name: 'James'
                },
                date: new Date()
            }
        ]
    });
};

exports.createPost = (request, response, next) => {
    const title = request.body.title;
    const content = request.body.content;

    response.status(201).json({
        message: 'Post created successfully!',
        post: { 
            id: new Date().getTime().toString(),
            title: title,
            content: content
        }
    });
};