import { mySQLConnection } from "../utils/mysqlconnection";
import { USER_ROLES } from "../utils/enums";
import CryptoJS from "crypto-js";
export interface UserI {
    userId?: number;
    userName: string;
    userPw?: string;
    userMail?: string;
    userRole? : USER_ROLES.ADMIN | USER_ROLES.USER | USER_ROLES.MODERATOR;
    fullName?: string;}

export class User {
    private _userId!: number;
    private _userName!: string;
    private _userPw!: string | undefined;
    private _userRole!: USER_ROLES.ADMIN | USER_ROLES.USER | USER_ROLES.MODERATOR;
    private _userMail!: string;
    
    constructor({userId,userName, userPw, userRole=USER_ROLES.USER}: UserI) {
        if (userId !== undefined)
            this._userId = userId;
        if (userName !== undefined)
            this._userName = userName;
        if (userPw !== undefined)
            this._userPw = userPw;
        if (userRole !== undefined)
            this._userRole = userRole;
    }
  

    get userId() {
        return this._userId;
    }

    get userName() {
        return this._userName;
    }
    get userRole(){
        return this._userRole;
    }
    toJSON() {
        return {
            userId: this._userId,
            userName: this._userName,
            userRole: this._userRole,
        };
    }
    async create(): Promise<User | null> {
        const connection = await mySQLConnection();
        return new Promise((resolve,rejects)=>{
            connection.query('INSERT INTO user (username, userpw , userrole) VALUES (?,?,?)',[this._userName,this._userPw,this._userRole],(err,results)=>{
                if(err){
                    rejects(err);
                }else{
                    const { insertId } = results;
                    this._userId = insertId;
                    resolve(this);
                }
            });
        }) }
    static async singIn(userName: string, userPw: string): Promise<User> {
        const connection = await mySQLConnection();
        return new Promise((resolve, rejects) => {
            connection.query('SELECT id as userid, username,password_hash as userpw, role as userrole FROM users WHERE username = ? AND password_hash = ?', [userName, CryptoJS.MD5(userPw).toString(CryptoJS.enc.Hex)], (err, results) => {
                if (err) {
                    rejects(err);
                } else {
                    if (results.length === 0) {
                        rejects(new Error('User not found'));
                    }
                    resolve(new User({userId:results[0].userid, userName: results[0].username, userPw: results[0].userpw, userRole: results[0].userrole}));
                }
            });
        })
    }
    
   
}