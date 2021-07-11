import store from "@/store"

export default function errorHandler(err) {
    let response = { isError: true }
    response.data = err.response ? err.response.data : { type: 'Erreur', message: 'Une erreur est survenue, réessayez ultérieurement' }

    switch (response.data.type) {
        case 'DuplicateKey':
            response.data = { type: 'Erreur de syntaxe', message: 'Certains champs sont déjà réservés', fields: response.data.fields }
            break
        case 'AuthError':
            return
        case 'BodyError':
            response.data = { type: 'Erreur de syntaxe', message: 'Certains champs sont manquants et/ou erronnés', fields: response.data.fields }
            break
        case 'SyntaxError':
            response.data.type = 'Erreur'
            switch(response.data.message) {
                case 'Invalid credential':
                case 'Invalid password':
                    response.data.message = 'Identifiant et/ou mot de passe erroné'
                    break
            }
            break
    }

    store.commit('queueError', response.data)
    return response
}