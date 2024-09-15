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

    constructor(email: string, name: string, token?: string, id?: string) {
        this._id = id
        this._email = email
        this._name = name
        this._token = token
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