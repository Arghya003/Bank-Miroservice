import { Repository } from "typeorm";
import { Credential } from "../entity/credential.entity";
import { User } from "../entity/user.entity";
import { AppDataSource } from "../data-source";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { publishUserRegistered } from "../events/producers/userRegistered.producer";
import { createError } from "../utils";
import { config } from "../config";
import ms from 'ms';
import redis from "../config/redis";


interface RegisterDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}



export class AuthService {
    credentialRepository: Repository<Credential>;
    userRepository: Repository<User>;
    static register: any;

    constructor() {
        this.credentialRepository = AppDataSource.getRepository(Credential);
        this.userRepository = AppDataSource.getRepository(User);
    }

    async register({ firstName, lastName, email, password }: RegisterDTO) {
        const existing = await this.credentialRepository.findOneBy({ email })
        if (existing) {
            throw createError("User already exists", 400);
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User();
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;

        await this.userRepository.save(user);

        const credential = new Credential();
        credential.email = email;
        credential.passwordHash = passwordHash;
        credential.user = user;
        await this.credentialRepository.save(credential);

        await publishUserRegistered({
            key: user.id.toString(),
            value: user
        })

        return user;

    }


    async login(email: string, password: string) {
        const credential = await this.credentialRepository.findOne({
            where: { email },
            relations: ['user']
        })

        if (!credential) {
            throw createError("invalid credentials", 401);
        }

        const isValidPassword = await bcrypt.compare(password, credential.passwordHash);
        if (!isValidPassword) {
            throw createError("invalid credentials", 401);
        }

        const token = jwt.sign(
            {
                id: credential.id,
                email: credential.email,
                firstName: credential.user.firstName,
                lastName: credential.user.lastName,
            },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRES_IN as ms.StringValue }

        )

        await redis.setex(
            `auth:${credential.user.id}:${token}`,
            24 * 60 * 60,
            'true'
        )

        return {
            token,
            firstName: credential.user.firstName,
            lastName: credential.user.lastName,
            email: credential.email,
        }
    }
    async logout(userId:number,token:string){
        await redis.del(`auth:${userId}:${token}`)
    }
    

}


export default AuthService;