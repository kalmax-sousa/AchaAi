type UserJsonProps = {
    id: string
    name: string
    email: string
    token: string
    image_url: string
}

export class User {
    id?: string
    email: string
    name: string
    token?: string
    enrollment?: string
    image_url?: string

    constructor(email: string, name: string, param3?: string, param4?: string, image_url?: string) {
        this.email = email
        this.name = name
        this.image_url = image_url

        if (image_url) {
            this.token = param3
            this.id = param4
            this.image_url = image_url
        } else if (param4) {
            this.token = param3
            this.id = param4
        } else {
            this.enrollment = param3
        }
    }

    static fromJson({ id, name, email, token, image_url }: UserJsonProps): User {
        return new User(email, name, token, id, image_url)
    }
}
