interface ColorI {
    colorid?: number;
    colorname?: string; 
    colorhex?: string; 
} 
import { mySQLConnection } from '../utils/mysqlconnection'
export class Color {
    private _colorid!: number;
    private _colorname: string;
    private _colorhex: string;
    constructor({colorid, colorname, colorhex}: ColorI) {
        if (colorid !== undefined) 
        this._colorid = colorid; 
        if (colorname !== undefined) 
        this._colorname = colorname; 
        
        if (colorhex !== undefined) 
        this._colorhex = colorhex; 
    }   
    toJSON() {
        return {
            colorid: this._colorid,
            colorname: this._colorname,
            colorhex: this._colorhex,
        };
    }
    async create(): Promise<Color | null> {
        const connection = await mySQLConnection();
        return new Promise((resolve, rejects) => {
            connection.query('INSERT INTO color (colorname, colorhex) VALUES (?,?)', [this._colorname, this._colorhex], (err, results) => {
                if (err) {
                    rejects(err);
                } else {
                    const { insertId } = results;
                    this._colorid = insertId;
                    resolve(this);
                }
            });
        })
    }
    static async findColor(colorid): Promise<Color | null> { 
        const connection = await mySQLConnection();
        return new Promise(async (resolve, rejects) => {
            const connection = await mySQLConnection();
            connection.query('SELECT colorid,colorname,colorhex FROM color WHERE colorid = ?', [colorid], (err, results) => {
                if (err) {
                    rejects(err);
                } else {
                    if (results.length === 0) {
                        rejects(new Error('Color not found'));
                    }
                    resolve(new Color({colorid, colorname:results[0].colorname, colorhex:results[0].colorhex}));
                }
            });
        })
    }
    static async findAll(): Promise<Color[] | null> {
        const connection = await mySQLConnection();
        return new Promise((resolve, rejects) => {
            connection.query('SELECT colorid,colorname,colorhex FROM color', [], (err, results) => {
                if (err) {
                    rejects(err);
                } else {
                    const colors: Color[] = results.map((result) => new Color({colorid:result.colorid, colorname:result.colorname, colorhex:result.colorhex}));
                    resolve(colors);
                }
            });
        })
    }
    static async delete(colorid: number): Promise<Color | null> {
        const connection = await mySQLConnection();
        return new Promise((resolve, rejects) => {
            connection.query('DELETE FROM color WHERE colorid = ?', [colorid], (err, results) => {
                if (err) {
                    rejects(err);
                } else {
                    if (results.affectedRows === 0) {
                        rejects(new Error('Color not found'));
                    }
                    resolve(null);
                }
            });
        })
    }
    static async update({ colorid, colorname, colorhex }: ColorI): Promise<Color | null> {
        const connection = await mySQLConnection();
        return new Promise((resolve, rejects) => {
            connection.query('UPDATE color SET colorname = ?, colorhex = ? WHERE colorid = ?', [colorid, colorhex, colorid], (err, results) => {
                if (err) {
                    rejects(err);
                } else {
                    if (results.affectedRows === 0) {
                        rejects(new Error('Color not found'));
                    }
                    resolve(new Color({colorid, colorname, colorhex}));
                }
            });
        })
    }
}