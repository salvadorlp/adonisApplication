'use strict'

// Bring in model
const User = use('App/Models/User')

// Bring in validator
const { validate } = use('Validator')

class SessionController {
    async create({ view }){
        return view.render("session.create")
    }

    async store({ request, response, session, auth }){
        // Validate input
        const validation = await validate(request.all(), {
            email: 'required|email',
            password: 'required|min:6'
        })

        if(validation.fails()){
            session.withErrors(validation.messages()).flashAll()

            return response.redirect('back') // reload the same page
        }

        const { email, password } = request.all() // get all fields, tell me just email and password
        try {
            await auth.attempt(email, password)
        } catch (e) {
            session.flashExcept(["password"])
      
            session.flash({ notification: "Nós não conseguimos encontrar nenhuma conta com esses dados." })
      
            return response.redirect("/login")
          }
      
          session.flash({ notification: "Login feito com sucesso" })
          return response.redirect("/")
          // try: send which user is
    }

    async delete({ response, session, auth }){
        await auth.logout()
        session.flash({ notification: "Você se desconectou." })

    return response.redirect("/")
    }
}

module.exports = SessionController
