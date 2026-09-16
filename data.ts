export type Task={id:string;category:string;title:string;description:string;instructions:string;reward:number;active:boolean};
export const categories=['Article Writing','Research','Data Entry','AI & Data','Design','Social Media'];
export const starterTasks:Task[]=categories.flatMap((category,c)=>Array.from({length:10},(_,i)=>({
 id:`starter-${c+1}-${i+1}`,category,title:`${category} Test Task ${i+1}`,
 description:`Complete this ${category.toLowerCase()} task using the client brief.`,
 instructions:`Read the brief carefully, complete the required work, and submit a clear response. This is a starter/test task for the ${category} category.`,
 reward:[1,1.5,2,2.5,3][i%5],active:true
})));
export const defaultContact={email:'skillspace@gmail.com',whatsapp:'+254 700 000 000',message:'Need help? Contact SkillSpace support and we will assist you.'};
