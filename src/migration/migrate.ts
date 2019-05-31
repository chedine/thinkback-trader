import {
    Entity, Column, OneToMany, ManyToOne, Index,
    JoinColumn, JoinTable, PrimaryColumn, PrimaryGeneratedColumn
}
    from "typeorm";
import sqlite3 = require("sqlite3");
import { createConnection, getManager, getConnection } from "typeorm";

import * as R from "ramda";
import { FNO, ScripType } from "../../types/types";

const DATABASE = "./db/sample.db";

@Entity()
@Index("index1", ["symbol"], { unique: false })
@Index("index2", ["symbol","tradeDateTs"], { unique: true })
@Index("index3", ["underlying"], { unique: false })
@Index("index4", ["tradeDate","underlying"], { unique: false })
@Index("index5", ["expiryDate"], { unique: false })

export class Instrument {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column("text", { nullable: false })
    underlying: string;

    @Column("double", { nullable: false })
    close: number;

    @Column("double", { nullable: false })
    open: number;

    @Column("double", { nullable: false })
    low: number;

    @Column("double", { nullable: false })
    high: number;

    @Column("integer", { nullable: true })
    oi?: number;

    @Column("integer", { nullable: false })
    type: number;

    @Column("integer", { nullable: false })
    tradeDate: number;

    @Column("integer", { nullable: false })
    tradeDateTs: number;

    @Column("integer", { nullable: false })
    tradeHour: number;

    @Column("integer", { nullable: true })
    vol?: number;

    @Column("text", { nullable: false })
    symbol: string;

    @Column("integer", { nullable: false })
    expiryDate: number;

    @Column("integer", { nullable: false })
    expiryDateTs: number;
}

const setup = R.curry(async (dropSchema: boolean, databaseLocation: string) =>
    await createConnection({
        type: "sqlite",
        database: databaseLocation,
        entities: [
            Instrument
        ],
        dropSchema: dropSchema,
        // logging: ["error"],
        synchronize: true,
    }));

export const dropAndCreate = setup(true);
export const init = setup(false);

export const bootstrap = async function (fromScratch: boolean) {
    return fromScratch? dropAndCreate(DATABASE) : init(DATABASE);
}

export async function insertFeed(instruments: Instrument[]) {
    await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Instrument)
        .values(instruments)
        .execute();
}

export async function readAllScrips(): Promise<Instrument[]>{
    return getConnection()
    .getRepository(Instrument)
    .createQueryBuilder("instrument")
    //.where("user.id = :id", { id: 1 })
    //.getOne();
    .getMany();
}

const readScripsByXXX = R.curry(function(selector: string, value){
    const param: any = {[selector] : value};
    return getConnection()
    .getRepository(Instrument)
    .createQueryBuilder("instrument")
    .where(`instrument.${selector} = :${selector}`, param)
    //.where('instrument.underlying = :underlying', {selector:value})
    .getMany();
});

export const readScripsByUnderlying = readScripsByXXX("underlying");

export async function migrate(dump: FNO[]){
    insertFeed(dump);
}
async function test() {
    await bootstrap(true);
    const result = await insertFeed([{
        underlying: "NIFTY",
        open:10,
        low:9.888,
        high:13.55,
        close:8.7,
        symbol:"NIFTYSYM",
        oi:100,
        tradeDate:20190531,
        tradeDateTs:12334,
        expiryDate:20190627,
        expiryDateTs:123899,
        type:ScripType.Future,
        tradeHour:153023
    },
    {
        underlying: "NIFTY",
        open:1.678,
        low:3.888,
        high:13.55,
        close:8.7,
        symbol:"NIFTYCE",
        oi:100,
        tradeDate:20190531,
        tradeDateTs:12334,
        expiryDate:20190627,
        expiryDateTs:123899,
        type:ScripType.CallOption,
        tradeHour:153023
    },
    {
        underlying: "NIFTY",
        open:10,
        low:9.888,
        high:13.55,
        close:8.7,
        symbol:"NIFTYPUT",
        oi:100,
        tradeDate:20190531,
        tradeDateTs:12334,
        expiryDate:20190627,
        expiryDateTs:123899,
        type:ScripType.PutOption,
        tradeHour:153023
    }
    ]);
   // const result = await readScripsByUnderlying("sdf");
    return result;
}

test().then(console.log).catch(console.log);