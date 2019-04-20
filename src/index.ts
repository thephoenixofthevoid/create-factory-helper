function noop(){}
function error(msg){ return () => { throw new Error(msg) } }

const tooLate = error("Factory hooks can only be defined before the first instance is created");
const tooFast = error("Lock hooks before the the first instance is created");

interface Factory {
    call(...args): any;
    before(...hooks): this;
    after(...hooks): this;
    lock(): this;
}

export function createFactory(ctor, ...args1): Factory {
    
    const _before = [];
    const _after  = [];
    let locked = false;

    
    const factory = Object.assign(_factory, { before, after, lock })
    return factory;

    function _factory(...args2) {
        if (!locked) tooFast()

        const state = { args: [ ...args1, ...args2 ], inst: null };

        _before.forEach(hook => hook.call(null, state))
        const inst = state.inst = new ctor(...state.args);
        _after.forEach(hook => hook.call(inst, state, inst))

        return inst
    }

    function before (...hooks) {
        if (locked) tooLate()
        _before.push(...hooks);
        return factory; 
    }

    function after (...hooks) {
        if (locked) tooLate()
        _after.push(...hooks); 
        return factory; 
    }

    function lock() {
        locked = true;
        return factory; 
     }
    
}
