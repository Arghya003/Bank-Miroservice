import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()

export class Credential{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique:true})
    email:string;

    @Column({name:'password_hash'})
    passwordHash:string;

    @OneToOne(()=>User,(user)=>user.credential,{cascade:true})
    @JoinColumn({name:'user_id'})
    user:User;

    @Column({name:'created_at'})
    createdAt:Date;

    @Column({name:'updated_at'})
    updatedAt:Date;

   

}