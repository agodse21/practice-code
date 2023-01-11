import tax from "../tax calculator/tax.js";

test('calculate tax', () => { 
expect(tax(600000)).toBe(36000) 

})
test('calculate tax', () => { 
    expect(tax(450000)).toBe(22500) 
    
})
test('calculate tax', () => { 
    expect(tax(1100000)).toBe(33000) 
    
})