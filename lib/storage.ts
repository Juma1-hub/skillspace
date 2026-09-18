export type User={name:string,email:string,role:"worker"|"admin"};
export type Task={id:number,category:string,title:string,description:string,reward:number};
const seedCategories=["Article Writing","Research","Data Entry","AI & Data","Design","Social Media"];
const key="skillspace_demo_v1";
export function getState(){if(typeof window==="undefined")return null;const raw=localStorage.getItem(key);if(raw)return JSON.parse(raw);const tasks=seedCategories.flatMap((c,ci)=>Array.from({length:10},(_,i)=>({id:ci*10+i+1,category:c,title:`${c} task ${i+1}`,description:`Complete the assigned ${c.toLowerCase()} task carefully and submit your work.`,reward:2+(i%5)*0.5})));const s={users:[] as User[],tasks,submitted:[] as number[],transactions:[] as any[],balance:0,unlocked:5,supportEmail:"skillspace@gmail.com",supportWhatsApp:"0752372102"};localStorage.setItem(key,JSON.stringify(s));return s}
export function saveState(s:any){localStorage.setItem(key,JSON.stringify(s))}
export {seedCategories};