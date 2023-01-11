


function tax(amout) {
  if (amout < 250000) {
    return 0;
  } else if (amout > 250000 && amout < 500000) {
    let c = (10 / 100) * amout;
    c=(c/100)*50
    return c;
  } else if (amout > 500000 && amout < 1000000) {
    let c = (20 / 100) * amout;
    c=(c/100)*30
    return c;
  } else if (amout > 1000000) {
    let c = (30 / 100) * amout;
    c=(c/100)*10
    return c;
  }
}

export default tax;

//   - Below 2,50,000 no tax
// - Amount earned between 2,50,000 and 5,00,000 - 10% of the amount earned in this slab
// - Amount earned between 5,00,000 and 10,00,000 - 20% of the amount earned in this slab
// - Amount earned above 10,00,000 - 30% of the amount earned in this slab
