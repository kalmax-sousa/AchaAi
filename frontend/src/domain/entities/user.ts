type UserJsonProps = {
    id: string
    name: string
    email: string
    token: string
}

export class User {
    private _id?: string
    private _email: string
    private _name: string
    private _token?: string
    private _enrollment?: string

    constructor(email: string, name: string, param3?: string, param4?: string) {
        this._email = email
        this._name = name
        
        if (param4) {
            this._token = param3
            this._id = param4
        } 
        else {
            this._enrollment = param3
        }
    }

    get enrollment() {
        return this._enrollment
    }

    get id() {
        return this._id
    }

    get email() {
        return this._email
    }

    get name() {
        return this._name
    }

    get token() {    
        return this._token
    }

    static fromJson({ id, name, email, token }: UserJsonProps): User {
        return new User(email, name, token, id)
    }
}