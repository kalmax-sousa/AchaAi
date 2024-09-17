export interface UserRepository {
    create(email: string, enrollment: string, name: string, password: string, confirmation: string): Promise<void>
    recoveryPassword(password: string, token: string): Promise<void>
}