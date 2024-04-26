import {Database} from "sqlite-async"

const db = await Database.open(":memory:")

await db.run("create table teszt (id integer primary key autoincrement, a int, b int, check(b >= 10));")
await db.run("create table large_a_changes (id integer, date int, text int,change int);")

await db.run('create trigger if not exists check_a before update on teszt when ABS(new.a - old.a) > ABS(old.b) begin insert into large_a_changes (id,date,change) values(old.id,200,new.a-old.a); end;')

try{
    await db.transaction(async db => {
        await db.run("insert into teszt (a,b) values (3,40)")
        await db.run("update teszt  set a = 2000 where id==1;")
})
}catch (e){
    console.log("Hiba:"+e)
}

try{
    await db.transaction(async db => {
        await db.run("update teszt  set a = 1970 where id==1;")
})
}catch (e){
    console.log("Hiba:"+e)
}
try{
    await db.transaction(async db => {
        await db.run("insert into teszt (a,b) values (1,1)")
})
}catch (e){
    console.log("Hiba:"+e)
}


console.log(await db.all("select * from teszt"))
console.log(await db.all("select * from large_a_changes"))
