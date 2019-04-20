function noop(){}
function error(msg){ return () => { throw new Error(msg) } }

const tooLate = error("Factory hooks can only be defined before the first instance is created");
const tooFast = error("Lock hooks before the the first instance is created");

export function createFactory(ctor, ...args1) {
    
    const before = [];
    const after  = [];

    let locked = false;

    return Object.assign(factory, {
        before(...hooks) {
           if (locked) tooLate()
           before.push(...hooks); 
           return factory; 
        }, 
        after (...hooks) {  
           if (locked) tooLate()
           after.push(...hooks); 
           return factory; 
        }, 
        lock() {
           locked = true;
           return factory; 
        }
    })

    function factory(...args2) {
        if (!locked) tooFast()

        const state = { args: [ ...args1, ...args2 ], inst: null };

        before.forEach(hook => hook.call(null, state))
        const inst = state.inst = new ctor(...state.args);
        after.forEach(hook => hook.call(inst, state, inst))

        return inst
    }
}
