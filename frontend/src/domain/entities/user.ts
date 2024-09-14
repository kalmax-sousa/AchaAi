type UserJsonProps = {
    id: string
    name: string
    email: string
}

export class User {
    private _id?: string
    private _email: string
    private _name: string

    constructor(email: string, name: string, id?: string,) {
        this._id = id
        this._email = email
        this._name = name
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

    static fromJson({ id, name, email }: UserJsonProps): User {
        return new User(email, name, id)
    }
}