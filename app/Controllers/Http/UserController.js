'use strict'

// Bring in model
const User = use('App/Models/User')

// Bring in validator
const { validate } = use('Validator')

class UserController {
    create({ view }) {
        return view.render("user.create");
    }

    async store({ request, response, auth, session }){
        // Validate input
        const validation = await validate(request.all(), {
            username: 'required|min:2|max:15|unique:users,username',
            email: 'required|email|unique:users,email',
            password: 'required|min:6'
        })

        if(validation.fails()){
            session.withErrors(validation.messages()).flashAll()

            return response.redirect('back') // reload the same page
        }

        const data = request.only(['username', 'email', 'password'])
        
        const user = await User.create(data)

        session.flash({ notification: "User created successfully" })

        return response.redirect("/")
    }
}

module.exports = UserController
