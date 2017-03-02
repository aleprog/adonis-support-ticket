'use strict'

const User = use('App/Model/User')
const Validator = use('Validator')

class UsersController {
    /**
     * Show login page
     */
    * showLoginPage (request, response) {
        yield response.sendView('auth.login')
    }

    /**
     * Handle user authentication
     */
    * login (request, response) {

    }

    /**
     * Show register page
     */
    * showRegisterPage (request, response) {
        yield response.sendView('auth.register')
    }

    /**
     * Handle user registration
     */
    * register (request, response) {
        // validate form input
        const validation = yield Validator.validateAll(request.all(), User.rules)

        // show error messages upon validation fail
        if (validation.fails()) {
            yield request
                .withAll()
                .andWith({ errors: validation.messages() })
                .flash()

            return response.redirect('back')
        }

        // persist to database
        const user = yield User.create({
            username: request.input('username'),
            email: request.input('email'),
            password: request.input('password')
        })

        // login the user
        yield request.auth.login(user)

        // redirect to homepage
        response.redirect('/')
    }

    /**
     * Logout authenticated user
     */
    * logout(request, response) {
        yield request.auth.logout()
        response.redirect('/login')
    }
}

module.exports = UsersController