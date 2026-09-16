export const categories=['Article Writing','Research','Data Entry','AI & Data','Design','Social Media'];
export const tasks=categories.flatMap((category,c)=>Array.from({length:10},(_,i)=>({id:`${c+1}-${i+1}`,category,title:`${category} Starter Task ${i+1}`,reward:1+(i%4),description:`Complete this ${category.toLowerCase()} task according to the client instructions.`})));
