'use strict'

// Bring in model
const Post = use('App/Models/Post')

// Bring in validator
const { validate } = use('Validator')

class PostController {
    async index({ view }) {

        const posts = await Post.all()

        return view.render('posts.index', {
            title: 'Latest Posts',
            posts: posts.toJSON()
        })
    }

    async details({ params, view }) {
        const post = await Post.find(params.id)

        return view.render('posts.details', {
            post: post
        })
    }

    async add({ view }) {
        return view.render('posts.add')
    }

    async store({ request, response, session}) {
        // Validate input
        const validation = await validate(request.all(), {
            author: 'required|min:2|max:15',
            title: 'required|min:3|max:255',
            body: 'required|min:3'
        })

        if(validation.fails()){
            session.withErrors(validation.messages()).flashAll()

            return response.redirect('back') // reload the same page
        }

        const post = new Post()

        post.author = request.input('author')
        post.title = request.input('title')
        post.body = request.input('body')

        await post.save()

        session.flash({ notification: 'Post Adicionado!' })

        return response.redirect('/posts')
    }

    async edit({ params, view }) {
        const post = await Post.find(params.id)

        return view.render('posts.edit', {
            post: post
        })
    }

    async update({ params, request, response, session }) {
        // Validate input
        const validation = await validate(request.all(), {
            title: 'required|min:3|max:255',
            body: 'required|min:3'
        })

        if(validation.fails()){
            session.withErrors(validation.messages()).flashAll()

            return response.redirect('back') // reload the same page
        }

        const post = await Post.find(params.id)

        post.title = request.input('title')
        post.body = request.input('body')

        await post.save()

        session.flash({ notification: 'Post Atualizado!' })

        return response.redirect('/posts')
    }

    async destroy({ params, session, response }) {
        const post = await Post.find(params.id)

        await post.delete()

        session.flash({ notification: 'Post Apagado!' })

        return response.redirect('/posts')
    }
}

module.exports = PostController
