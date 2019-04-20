import { createFactory } from "../"

const factory1 = createFactory(Map)
    .after(function (state) {
       this.id = Math.random()
       this.set("hi", "there");
    })
    .lock()

const m1 = factory1();
const m2 = factory1();
const m3 = factory1();
const m4 = factory1();
const m5 = factory1();
const m6 = factory1();
const m7 = factory1();

console.log(m1, m2, m3, m4, m5, m6, m7)


