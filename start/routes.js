'use strict'

const PostController = require('../app/Controllers/Http/PostController')
// const { route } = require('@adonisjs/framework/src/Route/Manager')

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('home')

// Must be logged in
Route.group( () => {
    // Session
    Route.get("logout", "SessionController.delete")

    // Posts
    Route.get('/posts/add', 'PostController.add')
    Route.post('/posts', 'PostController.store')
    Route.get('/posts/edit/:id', 'PostController.edit')
    Route.put('/posts/:id', 'PostController.update')
    Route.delete('/posts/:id', 'PostController.destroy')
}).middleware(["auth"])

// Content access
Route.get('/posts', 'PostController.index')
Route.get('/posts/:id', 'PostController.details')

// Register Users
Route.get("register", "UserController.create")
Route.post("register", "UserController.store")

// Session
Route.get("/login", "SessionController.create")
Route.post("/login", "SessionController.store")